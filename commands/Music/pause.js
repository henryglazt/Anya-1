const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Pause extends Command {
    constructor(client) {
        super(client, {
            name: "pause",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
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
        if (player.paused) {
            embed.setDescription(musji.info + " " + message.translate("music/pause:PAUSED"));
            return message.channel.send(embed);
        } else {
            player.paused(true);
            embed.setDescription(musji.play + " " + message.translate("music/pause:SUCCESS"));
            return message.channel.send(embed);
        }
    }
}
module.exports = Pause;
