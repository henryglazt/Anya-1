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
const { Message, MessageEmbed } = require("discord.js");
const m = new Message();
const { Manager } = require("erela.js");
const { formatTime } = require("./helpers/functions");
const Spotify = require("erela.js-spotify"),
    clientID = client.config.spotify.id,
    clientSecret = client.config.spotify.secret;

require("./helpers/player");
const nodes = require("./helpers/nodes");
var timer;
var timer2;
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
        clearTimeout(timer);
        clearTimeout(timer2);
        let embed = new MessageEmbed()
        const channel = client.channels.cache.get(player.textChannel);
        embed.setAuthor("Now Playing", "https://cdn.discordapp.com/emojis/750364941449691206.gif")
        embed.setDescription(`[${track.title}](${track.uri}) - \`${formatTime(track.duration, true)}\``)
        embed.setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`)
        embed.setColor(config.embed.color)
        embed.setFooter(`Requested by: ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true })}`);
        channel.send(embed).then(msg => player.set("message", msg));
    })
    .on("playerDestroy", player => {
        clearTimeout(timer);
        clearTimeout(timer2);
    })
    .on("playerCreate", player => {
        let embed = new MessageEmbed()
                embed.setAuthor("Leaving... Bye...", "https://cdn.discordapp.com/emojis/754574913209368687.gif")
                embed.setFooter(config.embed.footer)
                embed.setColor(config.embed.color)
                embed.setDescription(`I've been idle for 3 minutes.\nThank you for using ${client.user.username}`)
        const channel = client.channels.cache.get(player.textChannel);
        timer = setTimeout(() => {
            channel.send(embed);
            player.destroy();
        }, 180000)
    })
    .on("socketClosed", (player, payload) => {
        if (payload.byRemote == true) {
            player.destroy()
        }
    })
    .on("trackEnd", player => {
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
    })
    .on("trackStuck", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel)
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send("Error encountered: Track stuck!")
    })
    .on("trackError", (player, track, payload) => {
        let embed = new MessageEmbed()
        const channel = client.channels.cache.get(player.textChannel)
        if (!player.get("message")) {
            return
        }
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send("Error encountered: Track error!")
    })
    .on("playerMove", (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
    })
    .on("queueEnd", player => {
        let embed = new MessageEmbed()
                embed.setAuthor("Queue Ended", "https://cdn.discordapp.com/emojis/750352772536467525.png")
                embed.setFooter(config.embed.footer)
                embed.setColor(config.embed.color)
                embed.setDescription("Add more songs before im leaving in 3 minutes.")
        const channel = client.channels.cache.get(player.textChannel);
        channel.send(embed);
        timer2 = setTimeout(() => {
            embed.setAuthor("Leaving... Bye...", "https://cdn.discordapp.com/emojis/754574913209368687.gif")
            embed.setDescription(`I've been idle for 3 minutes.\nThank you for using ${client.user.username}`)
            channel.send(embed);
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
