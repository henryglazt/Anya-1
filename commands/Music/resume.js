const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Resume extends Command {
    constructor(client) {
        super(client, {
            name: "resume",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
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
        let sid = player.get("voiceData").session;
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
        if (sessionID !== sid) {
            embed.setDescription(musji.info + " " + message.translate("music/play:SESSION"));
            return message.channel.send(embed);
        }
        if (!player.paused) {
            embed.setDescription(musji.info + " " + message.translate("music/resume:NOT_PAUSED"));
            return message.channel.send(embed);
        } else {
            player.pause(false);
            embed.setDescription(musji.play + " " + message.translate("music/resume:SUCCESS"));
            return message.channel.send(embed);
        }
    }
}
module.exports = Resume;
