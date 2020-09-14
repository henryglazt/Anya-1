const Command = require("../../base/Command.js"),
    Discord = require("discord.js"),
    createBar = require("string-progressbar");

class Nowplaying extends Command {

    constructor(client) {
        super(client, {
            name: "nowplaying",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["np"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }

    async run(message, args, data) {

        const queue = this.client.distube.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.error("music/play:NO_VOICE_CHANNEL");
        }

        if (!queue) {
            return message.error("music/play:NOT_PLAYING");
        }

        const song = queue.songs[0];
        const seek = (queue.dispatcher.streamTime - queue.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/np:NOW_PLAYING"), "https://cdn.discordapp.com/emojis/750364941449691206.gif")
            .setThumbnail(queue.songs[0].thumbnail)
            .addField(message.translate("music/np:TITLE"), "[" + queue.songs[0].name + "](" + queue.songs[0].url + ")")
            .addField(
                message.translate("music/np:ELAPSED"),
                "`" + new Date(seek * 1000)
                .toISOString()
                .substr(11, 8) + "\n" +
                createBar(song.duration == 0 ? seek : song.duration, seek, 19)[0] + "\n" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000)
                    .toISOString()
                    .substr(11, 8)) + "`"
            )
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer);
        message.channel.send(embed);

    }
}

module.exports = Nowplaying;
