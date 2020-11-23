const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
    { arrSwap } = require("../../helpers/functions.js");
class Swap extends Command {
    constructor(client) {
        super(client, {
            name: "swap",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "tukar" ],
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
        if (!player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }

        let from = Number(args[0]);
        let to = Number(args[1]);
        if (!from || !to || from === to || isNaN(from) || isNaN(to) || from < 1 || to < 1|| from > player.queue.size || to > player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/swap:VALUE", {
               max: player.queue.size
            }));
            return message.channel.send(embed);
        }
        arrSwap(player.queue, from -1, to -1);
        embed.setDescription(musji.swap + " " + message.translate("music/swap:SUCCESS", {
           songName: player.queue[to -1].title,
           songURL: player.queue[to -1].uri,
           indexFrom: from,
           indexTo: to
        }));
        return message.channel.send(embed);
    }
}
module.exports = Swap;
