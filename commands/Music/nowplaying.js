const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
    { formatDuration } = require("../../helpers/functions.js");

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

const emojis = this.client.customEmojis;

        try {
            const player = this.bot.music.players.get(message.guild.id);
            if (!player || player.queue.size === 0 || (player.position === 0 && !player.playing)) return message.channel.send('**Nothing Playing In This Server!**');

            const { channel } = message.member.voice;
            if (!channel) return message.channel.send('**You Have To Be Connected To A Voice Channel!**');

            if (channel.id !== player.voiceChannel) return message.channel.send('**You Have To Be In The Same Voice Channel With The Bot!**');

            let video = player.queue.current;
            let description;

            if (video.isStream) {
                description = 'Live Stream';
            } else {
                const part = Math.floor((player.position / video.duration) * 30);
                const positionObj = {
                    seconds: Math.floor((player.position / 1000) % 60),
                    minutes: Math.floor((player.position / (1000 * 60)) % 60),
                    hours: Math.floor((player.position / (1000 * 60 * 60)) % 24)
                };
                const totalDurationObj = {
                    seconds: Math.floor((video.duration / 1000) % 60),
                    minutes: Math.floor((video.duration / (1000 * 60)) % 60),
                    hours: Math.floor((video.duration / (1000 * 60 * 60)) % 24)
                };
                description = `${'─'.repeat(part) + emojis.music.np + '─'.repeat(30 - part)}\n\n\`${formatDuration(positionObj)} / ${formatDuration(totalDurationObj)}\``;
            };

            const videoEmbed = new MessageEmbed()
                .setThumbnail(`https://i.ytimg.com/vi/${video.identifier}/hqdefault.jpg`)
                .setColor(data.config.embed.color)
                .setTitle(video.title)
                .setDescription(description)
                .setFooter(data.config.embed.footer)
            return message.channel.send({ embed: videoEmbed });
        } catch (error) {
            console.error(error);
            return message.channel.send(`An Error Occurred: \`${error.message}\`!`);
        };
    };



    /*const player = message.client.manager.players.get(message.guild.id);


    if(!player) return message.channel.send(idioma.np.nada)


    const { title, duration } = player.queue.current;

    const progressBar = porgressBar({ currentPositon: player.position > 0 ? player.position : "1", endPositon: duration, width: 10, barStyle: "▬", currentStyle: player.playing ? "<:gangsebelah:774970576355328000>" : "<:gangsebelah:774970576355328000>"  }, { format:" [ <bar> ] " })

    let embed = new MessageEmbed()
    embed.setTimestamp()
    embed.setAuthor("NowPlaying", message.author.displayAvatarURL({ dynamic: true }))
    embed.setColor(data.config.embed.color)
    embed.setDescription(`${player.playing ? API.emojis.play.id : API.emojis.pause.id} ${title}\n${progressBar} \`${player.position <= 60000 ? `${API.time2(player.position)}s` : API.time2(player.position)} / ${API.time2(duration)}\``);
    message.channel.send(embed)*/


        /*const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const queue = this.client.distube.getQueue(message.guild.id);
        if (!queue) {
            xembed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(xembed);
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
        message.channel.send(embed);*/
    }
}
module.exports = Nowplaying;
