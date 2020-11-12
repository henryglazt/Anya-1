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
const Discord = require("discord.js");
const { Manager } = require("erela.js");
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
        let embed = new Discord.MessageEmbed()
        const channel = client.channels.cache.get(player.textChannel);
        embed.setAuthor("Now Playing", "https://cdn.discordapp.com/emojis/750364941449691206.gif")
        embed.setDescription(`[${track.title}](${track.uri})`)
        embed.setTimestamp()
        embed.setColor(config.color)
        embed.setFooter(`Requested by: ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true })}`)
        channel.send(embed).then(msg => player.set("message", msg));
    })
    .on("playerDestroy", player => {
        clearTimeout(timer);
    })
    .on("playerCreate", player => {
        let embed = new Discord.MessageEmbed()
                embed.setTimestamp()
                embed.setColor(config.color)
                embed.setDescription("music/stop:IDLE")
        const channel = client.channels.cache.get(player.textChannel);
        timer = setTimeout(function () {
            channel.send("embed");
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
        channel.send("music/play:ERROR")
    })
    .on("trackError", (player, track, payload) => {
        let embed = new Discord.MessageEmbed()
        const channel = client.channels.cache.get(player.textChannel)
        if (!player.get("message")) {
            return
        }
        if (player.get("message") && !player.get("message").deleted) player.get("message").delete();
        channel.send("music/play:ERROR")
    })
    .on("playerMove", (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
    })
    .on("queueEnd", player => {
        let embed = new Discord.MessageEmbed()
                embed.setTimestamp()
                embed.setColor(config.color)
                embed.setDescription("music/play:QUEUE_ENDED")
        const channel = client.channels.cache.get(player.textChannel);
        channel.send("embed");
        timer2 = setTimeout(function () {
            embed.setDescription("music/stop:IDLE")
            channel.send("embed");
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
