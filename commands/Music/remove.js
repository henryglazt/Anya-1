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
        const embed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const number = args[0];
        const queue = this.client.distube.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!this.client.distube.isPlaying(message)) {
            embed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (!queue.songs[1]) {
            embed.setDescription(message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }
        if (!number) {
            embed.setDescription(message.error("music/remove:VALUE"));
            return message.channel.send(embed);
        }
        if (number <= 0) {
            embed.setDescription(message.error("music/remove:VALUE"));
            return message.channel.send(embed);
        }
        if (isNaN(number)) {
            embed.setDescription(message.error("music/remove:VALUE"));
            return message.channel.send(embed);
        }
        const song = queue.songs[number];
        embed.setDescription(message.translate("music/remove:SUCCESS", {songName: song.name, songURL: song.url}));
        message.channel.send(embed);
        return queue.songs.splice(number, 1);
    }
}
module.exports = Remove;
