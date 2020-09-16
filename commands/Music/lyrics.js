const Command = require("../../base/Command.js"),
    Discord = require("discord.js"),
    lyricsFinder = require("lyrics-finder");

class Lyrics extends Command {

    constructor(client) {
        super(client, {
            name: "lyrics",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: ["lyric", "lirik", "ly"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }

    async run(message, args, data) {
        const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const queue = this.client.distube.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            xembed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            xembed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        if (!this.client.distube.isPlaying(message)) {
            xembed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(xembed);
        }
        let song = queue.songs[0];
        let lyrics = null;
        try {
            lyrics = await lyricsFinder(song.name, "");
            if (!lyrics) {
                xembed.setDescription(message.translate("music/lyrics:NO_LYRICS_FOUND", {songName: song.name, songURL: song.url}));
                return message.channel.send(xembed);
            }
        } catch (error) {
            xembed.setDescription(message.translate("music/lyrics:ERROR", {error: error}));
            return message.channel.send(xembed);
        }
        let lyricsEmbed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/lyrics:LYRICS_OF"), "https://cdn.discordapp.com/emojis/755359026862227486.png")
            .setTitle(song.name)
            .setURL(song.url)
            .setDescription(lyrics)
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer);
        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed)
            .catch(console.error);
    }
}
module.exports = Lyrics;
