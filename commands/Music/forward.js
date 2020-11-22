const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
    { formatTime, parseTime } = require("../../helpers/functions.js");
class Forward extends Command {
    constructor(client) {
        super(client, {
            name: "forward",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "fw" ],
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
        let v = player.get("voiceData");
        const { channel, sessionID } = message.member.voice;
        if (!channel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player || !player.queue.current) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (sessionID !== v.session) {
            embed.setDescription(musji.info + " " + message.translate("music/play:SESSION", {user: "<@" + v.id + ">"}));
            return message.channel.send(embed);
        }
        let time = parseTime(args.join(''));
        let timestampInMS = player.position + time;
        if (timestampInMS === null) {
            embed.setDescription(musji.info + " " + message.translate("music/seek:NO_ARGS"));
            return message.channel.send(embed);
        }
        if (timestampInMS > player.queue.current.duration || timestampInMS < 0) {
            embed.setDescription(musji.info + " " + message.translate("music/seek:BEYOND"));
            return message.channel.send(embed);
        }
        if (!player.queue.current.isSeekable || player.queue.current.isStream) {
            embed.setDescription(musji.info + " " + message.translate("music/seek:SEEKABLE"));
            return message.channel.send(embed);
        } else {
            player.seek(timestampInMS);
            embed.setDescription(musji.forward + " " + message.translate("music/seek:SUCCESS", {
               pos: formatTime(player.position),
               dur: formatTime(player.queue.current.duration)
            }));
            return message.channel.send(embed);
        }
    }
}
module.exports = Forward;
