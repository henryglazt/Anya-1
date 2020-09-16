const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Filter extends Command {
    constructor(client) {
        super(client, {
            name: "filter",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.error("music/play:NO_VOICE_CHANNEL");
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            return message.error("music/play:MY_VOICE_CHANNEL");
        }
        if (!this.client.distube.isPlaying(message)) {
            return message.error("music/play:NOT_PLAYING");
        }
        if (!args[0]) {
            return message.error("music/filter:NO_ARGS");
        }
        const filters = [`3d`, `bassboost`, `echo`, `flanger`, `gate`, `haas`, `karaoke`, `nightcore`, `reverse`, `vaporwave`]
        if (filters.includes(args[0])) {
            let filter = this.client.distube.setFilter(message, args[0]);
            message.channel.send({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    description: filter ? message.translate("music/filter:MODE", {filter: filter}) : message.translate("music/filter:OFF")
                }
            })
        } else {
            message.channel.send({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    description: message.translate("music/filter:NO_FILTER", {
                        named: args[0]
                    })
                }
            })
        }
    }
}
module.exports = Filter;
