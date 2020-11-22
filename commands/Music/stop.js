const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Stop extends Command {
    constructor(client) {
        super(client, {
            name: "stop",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "dc", "leave", "disconnect" ],
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
        if (!player) {
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
        if (!player.queue.current) {
            player.destroy();
            embed.addField(musji.leave + " " + message.translate("music/stop:LEAVE"), message.translate("music/stop:THANK", {
              anya: this.client.user.username
            }));
            embed.setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png");
            return message.channel.send(embed);
        }
        player.destroy();
        embed.addField(musji.stop + " " + message.translate("music/stop:SUCCESS"), message.translate("music/stop:THANK", {
          anya: this.client.user.username
        }));
        embed.setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png");
        return message.channel.send(embed);
    }
}
module.exports = Stop;
