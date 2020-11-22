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
        let duration;
        if (track.isStream) {
            duration = "\n" + musji.live1 + musji.live2;
        } else {
            duration = `\`${formatTime(track.duration)}\``;
        }
        let m = player.get("member");
        let v = player.get("voiceData")
        clearTimeout(v.timeout);
        let embed = new MessageEmbed()
        embed.addField(musji.play + " " + m.guild.translate("music/play:NOW_PLAYING"), m.guild.translate("music/play:SONG", {
          songName: track.title,
          songURL: track.uri,
          songDuration: duration
        }));
        embed.setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`);
        embed.setColor(config.embed.color);
        embed.setFooter(m.guild.translate("common:REQUESTEDBY") + ": " + track.requester.tag, track.requester.displayAvatarURL({ dynamic: true }));
        channel.send(embed).then(msg => player.set("message", msg));
    })
    .on("playerDestroy", player => {
        let v = player.get("voiceData");
        clearTimeout(v.timeout);
    })
    .on("playerCreate", async player => {
        const channel = await client.channels.cache.get(player.textChannel);
        let m = await player.get("member");
        let v = await player.get("voiceData");
        let embed = new MessageEmbed()
            embed.setColor(config.embed.color);
            embed.setFooter(config.embed.footer);
            embed.setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png");
            embed.addField(musji.leave + " " + m.guild.translate("music/stop:LEAVE"), m.guild.translate("music/stop:IDLE") + "\n" + m.guild.translate("music/stop:THANK", {
              anya: client.user.username
            }));
        v.timeout = setTimeout(() => {
         channel.send(embed);
          player.destroy();
        }, 180000);
    })
    .on("trackEnd", player => {
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
    })
    .on("trackStuck", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send(musji.info + " " + m.guild.translate("music/play:ERROR", {
          error: payload.thresholdMS
        }));
    })
    .on("trackError", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        if (!player.get("message")) {
            return
        }
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send(musji.info + " " + m.guild.translate("music/play:ERROR", {
          error: payload.error
        }));
    })
    .on("playerMove", (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
    })
    .on("queueEnd", player => {
        const channel = client.channels.cache.get(player.textChannel);
        let m = player.get("member");
        let v = player.get("voiceData");
        let embed1 = new MessageEmbed()
            embed1.setColor(config.embed.color);
            embed1.setFooter(config.embed.footer);
            embed1.addField(musji.info + " " + m.guild.translate("music/play:QUEUE_ENDED"), m.guild.translate("music/play:3MIN"));
        let embed2 = new MessageEmbed()
            embed2.setColor(config.embed.color);
            embed2.setFooter(config.embed.footer);
            embed2.setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png");
            embed2.addField(musji.leave + " " + m.guild.translate("music/stop:LEAVE"), m.guild.translate("music/stop:IDLE") + "\n" + m.guild.translate("music/stop:THANK", {
              anya: client.user.username
            }));
        if (v.channel !== null) {
            channel.send("<@" + v.id + ">", embed1);
        } else {
            channel.send(embed1);
        }
        v.timeout = setTimeout(() => {
            channel.send(embed2);
            player.destroy();
        }, 180000);
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
