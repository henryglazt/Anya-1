const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Autoplay extends Command {
    constructor(client) {
        super(client, {
            name: "autoplay",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["ap"],
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
        let mode = this.client.distube.toggleAutoplay(message);
        xembed.setDescription(mode ? message.translate("music/autoplay:ON") : message.translate("music/autoplay:OFF"));
        return message.channel.send(xembed);
    }
}
module.exports = Autoplay;
