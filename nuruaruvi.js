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

const Discord = require("discord.js");
const NuruAruvi = require("./base/NuruAruvi"),
    client = new NuruAruvi();

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

    client.distube
        .on("playSong", (message, queue, song) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    thumbnail: {
                        url: song.thumbnail
                    },
                    description: message.translate("music/play:NOW_PLAYING", {
                        songName: song.name,
                        songURL: song.url,
                        songDuration: song.duration == 0 ? "◉ LIVE" : song.formattedDuration
                    })
                }
            })
        })
        .on("addSong", (message, queue, song) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    thumbnail: {
                        url: song.thumbnail
                    },
                    description: message.translate("music/play:ADDED", {
                        songName: song.name,
                        songURL: song.url,
                        songDuration: song.duration == 0 ? "◉ LIVE" : song.formattedDuration
                    })
                }
            })
        })
        .on("playList", (message, queue, playlist, song) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.foote
                    },
                    thumbnail: {
                        url: playlist.thumbnail
                    },
                    description: message.translate("music/play:ADDED_PL", {
                            items: playlist.total_items,
                            plTitle: playlist.title,
                            plURL: playlist.url,
                            plDuration: playlist.formattedDuration
                        }) + "\n\n" +
                        message.translate("music/play:NOW_PLAYING", {
                            songName: song.name,
                            songURL: song.url,
                            songDuration: song.duration == 0 ? "◉ LIVE" : song.formattedDuration
                        })
                }
            })
        })
        .on("addList", (message, queue, playlist) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    thumbnail: {
                        url: playlist.thumbnail
                    },
                    description: message.translate("music/play:ADDED_PL", {
                        items: playlist.total_items,
                        plTitle: playlist.title,
                        plURL: playlist.url,
                        plDuration: playlist.formattedDuration
                    })
                }
            })
        })
        .on("initQueue", queue => {
            queue.autoplay = false;
            queue.volume = 100;
        })
        .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send({
                    embed: {
                        color: config.embed.color,
                        description: message.translate("music/play:RESULTS_HEADER") + "\n\n" +
                            result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.duration == 0 ? "◉ LIVE" : song.formattedDuration}\``)
                            .join("\n"),
                        footer: {
                            text: message.translate("music/play:RESULTS_FOOTER")
                        }
                    }
                })
                .then(m => {
                    m.delete({
                        timeout: 60000
                    })
                });
        })
        .on("searchCancel", (message) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    description: message.translate("music/play:CANCELLED")
                }
            })
        })
        .on("noRelated", message => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    description: message.translate("music/play:NO_RESULT")
                }
            })
        })
        .on("finish", message => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    description: message.translate("music/play:QUEUE_ENDED")
                }
            })
        })
        .on("empty", message => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    description: message.translate("music/play:EMPTY")
                }
            })
        })
        .on("error", (message, err) => {
            message.channel.send({
                embed: {
                    color: config.embed.color,
                    footer: {
                        text: config.embed.footer
                    },
                    description: message.translate("music/play:ERROR", {
                        error: err
                    })
                }
            })
        })

    client.login(process.env.TOKEN);

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
