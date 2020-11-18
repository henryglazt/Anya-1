require("./helpers/extenders");

const Sentry = require("@sentry/node"),
    util = require("util"),
    fs = require("fs"),
    readdir = util.promisify(fs.readdir),
    mongoose = require("mongoose");

const config = require("./config");
if (config.apiKeys.sentryDSN) {
    Sentry.init({
        dsn: config.apiKeys.sentryDSN
    });
}

const NuruAruvi = require("./base/NuruAruvi"),
    client = new NuruAruvi();
const { MessageEmbed } = require("discord.js");
const { Manager } = require("erela.js");
const { formatTime } = require("./helpers/functions");
const Spotify = require("erela.js-spotify"),
    clientID = config.spotify.id,
    clientSecret = config.spotify.secret;

require("./helpers/player");
const nodes = require("./helpers/nodes");
const musji = client.customEmojis.music;
client.manager = new Manager({
        nodes,
        plugins: [ new Spotify({ clientID, clientSecret, convertUnresolved: true })],
            autoPlay: true,
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
    })
    .on("nodeConnect", () => console.log(`[NODE] - connected`))
    .on("nodeError", (node, error) => console.log(`[NODE] - error encountered: ${error.message}.`))
    .on("trackStart", (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        clearTimeout(m.id);
        let embed = new MessageEmbed()
        embed.setDescription(musji.play + " " + m.guild.translate("music/play:NOW_PLAYING", {
          songName: track.title,
          songURL: track.uri,
          songDuration: formatTime(track.duration, true)
        }));
        embed.setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`)
        embed.setColor(config.embed.color)
        embed.setFooter(m.guild.translate("music/play:REQ", {
          user: track.requester.tag
        }), track.requester.displayAvatarURL({ dynamic: true }));
        channel.send(embed).then(msg => player.set("message", msg));
    })
    .on("playerDestroy", player => {
        let m = player.get("member");
        return clearTimeout(m.id);
    })
    /*.on("playerCreate", async player => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        if (!m) m = player.guild;
        let embed = new MessageEmbed()
            embed.setColor(config.embed.color)
            embed.setFooter(config.embed.footer)
            embed.setDescription(musji.leave + " " + m.guild.translate("music/stop:IDLE", {
              anya: client.user.username
            }));
        m.id = setTimeout(() => {
         channel.send(embed);
          player.destroy();
        }, 180000)
    })*/
    .on("trackEnd", player => {
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
    })
    .on("trackStuck", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send(m.guild.error("music/play:ERROR", {
          error: payload.thresholdMs
        }))
    })
    .on("trackError", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        if (!player.get("message")) {
            return
        }
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send(m.guild.error("music/play:ERROR", {
          error: payload.error
        }))
    })
    .on("playerMove", (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
    })
    .on("queueEnd", player => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        let embed1 = new MessageEmbed()
            embed1.setColor(config.embed.color)
            embed1.setFooter(config.embed.footer)
            embed1.setDescription(musji.info + " " + m.guild.translate("music/play:QUEUE_ENDED"));
        let embed2 = new MessageEmbed()
            embed2.setColor(config.embed.color)
            embed2.setFooter(config.embed.footer)
            embed2.setImage("https://cdn.discordapp.com/attachments/544570919553859597/777604827752169472/1543963619588.jpg")
            embed2.setDescription(musji.leave + " " + m.guild.translate("music/stop:IDLE", {
              anya: client.user.username
            }));
        channel.send("<@" + m.id + ">", embed1);
        m.id = setTimeout(() => {
            channel.send(embed2);
            player.destroy();
        }, 180000)
    });

    client.on("raw", d => client.manager.updateVoiceState(d));

    const init = async() => {

    const directories = await readdir("./commands/");
    client.logger.log(`Loading a total of ${directories.length} categories.`, "log");
    directories.forEach(async(dir) => {
        const commands = await readdir("./commands/" + dir + "/");
        commands.filter((cmd) => cmd.split(".")
                .pop() === "js")
            .forEach((cmd) => {
                const response = client.loadCommand("./commands/" + dir, cmd);
                if (response) {
                    client.logger.log(response, "error");
                }
            });
    });

    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new(require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    client.system.importConfig(require("./rr.json"))

    client.system.init()

    client.login(client.config.token);

    mongoose.connect(client.config.mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            client.logger.log("Connected to the Mongodb database.", "log");
        })
        .catch((err) => {
            client.logger.log("Unable to connect to the Mongodb database. Error:" + err, "error");
        });

    const languages = require("./helpers/languages");
    client.translations = await languages();

    };

init();

client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", (e) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"));

process.on("unhandledRejection", (err) => {
    console.error(err);
});
