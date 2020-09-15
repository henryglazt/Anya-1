const Command = require("../../base/Command.js");

class Pause extends Command {

    constructor(client) {
        super(client, {
            name: "pause",
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
        const queue = this.client.distube.getQueue(message);
        if (queue.dispatcher.paused) {
            message.channel.send({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    description: message.translate("music/pause:PAUSED")
                }
            })
        } else {
            queue.dispatcher.pause();
            message.channel.send({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    description: message.trasnlate("music/pause:SUCCESS")
                }
            })
        }
    }
}

module.exports = Pause;
