const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Loopsong extends Command {
    constructor(client) {
        super(client, {
            name: "loopsong",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "ls" ],
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
        if (!player) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player.trackRepeat) {
            player.setTrackRepeat(true);
            embed.setDescription(musji.repeatone + " " + message.translate("music/ls:SUCCESS"));
            return message.channel.send(embed);
        } else {
            player.setTrackRepeat(false);
            embed.setDescription(musji.repeatone + " " + message.translate("music/ls:OFF"));
            return message.channel.send(embed);
        };
    }
}
module.exports = Loopsong;
