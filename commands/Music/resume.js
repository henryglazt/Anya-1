const Command = require("../../base/Command.js");

class Resume extends Command {

    constructor(client) {
        super(client, {
            name: "resume",
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

    async run(message) {

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

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            return message.error("music/play:MY_VOICE_CHANNEL");
        }

        const queue = this.client.distube.getQueue(message);
        if (!queue.dispatcher.paused) {
            message.error("music/resume:NOT_PAUSED")
        } else {
            queue.dispatcher.resume();
            message.sendT("music/resume:SUCCESS");
        }
    }
}

module.exports = Resume;
