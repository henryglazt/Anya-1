const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["hapus"],
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
        const number = args[0];
        const queue = this.client.distube.getQueue(message);
        if (!queue.songs[1]) {
            return message.error("music/skip:NO_NEXT_SONG");
        }
        if (!number) {
            return message.error("music/remove:VALUE")
        }
        if (isNaN(number)) {
            return message.error("music/remove:VALUE")
        }
        const song = queue.songs[number];
        message.channel.send({
            embed: {
                color: data.config.embed.color,
                footer: {
                    text: data.config.embed.footer
                },
                description: message.translate("music/remove:SUCCESS", {
                    songName: song.name,
                    songURL: song.url
                })
            }
        })
        return queue.songs.splice(number, 1);
    }
}
module.exports = Remove;
