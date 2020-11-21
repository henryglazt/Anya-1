const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "hapus" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

        const musji = this.client.customEmojis.music;
        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)

        const player = message.client.manager.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (!channel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player || !player.playing || !player.paused || player.queue.totalSize === 0) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }

        let track = Number(args[0]);
        let song = player.queue[track - 1];
        if (!track || isNaN(track) || track < 1 || track > player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skipto:VALUE", {
               max: player.queue.size
            }));
            return message.channel.send(embed);
        }
        if (track >= 1 && player.queue.size !== track) {
            player.queue.splice(track - 1, 1);
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`);
            embed.addField(musji.remove + " " + message.translate("music/remove:SUCCESS"), `[${song.title}](${song.uri})`);
            return message.channel.send(embed);
        } else if (track >= 1 && player.queue.size === track) {
            player.queue.splice(player.queue.length - 1, 1);
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`);
            embed.addField(musji.remove + " " + message.translate("music/remove:SUCCESS"), message.translate("music/nowplaying:SONG", {
               songName: song.title,
               songURL: song.uri
            }));
            return message.channel.send(embed);
        };
        /*const embed = new Discord.MessageEmbed()
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
        return queue.songs.splice(number, 1);*/
    }
}
module.exports = Remove;
