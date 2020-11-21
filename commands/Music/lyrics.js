const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
    lyricsFinder = require("lyrics-finder");

class Lyrics extends Command {

    constructor(client) {
        super(client, {
            name: "lyrics",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [ "lyric", "lirik", "ly" ],
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

        let song = args.join(" ");
        if (!args.length) song = player.queue.current;
        let lyrics = null;
        try {
            lyrics = await lyricsFinder(song.title, "");
            if (!lyrics) {
                embed.setDescription(musji.info + " " + message.translate("music/lyrics:NO_LYRICS_FOUND", {songName: song.title, songURL: song.uri}));
                return message.channel.send(embed);
            }
        } catch (error) {
            embed.setDescription(musji.info + " " + message.translate("music/lyrics:ERROR", {error: error}));
            return message.channel.send(embed);
        }
        let lyricsEmbed = new MessageEmbed()
            .setAuthor(message.translate("music/lyrics:LYRICS_OF"), "https://cdn.discordapp.com/attachments/733966113167245312/779781365448966214/lyrics.png")
            .setTitle(song.title)
            .setURL(song.uri)
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
