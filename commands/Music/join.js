const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Join extends Command {
    constructor(client) {
        super(client, {
            name: "join",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "summon", "masuk" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

        let voiceData = {
            id: message.member.id,
            guild: message.member.guild.id
            channel: message.member.voice.channel.id,
            session: message.member.voice.sessionID,
            timeout: {}
        };
        const musji = this.client.customEmojis.music;
        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)

        const player = message.client.manager.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (!channel) {
            embed.setDescription(this.client.customEmojis.error + " " + message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player) {
          const player = message.client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
          });
          if (!channel.joinable) {
            embed.setDescription(musji.info + " " + message.translate("music/play:CONNECT"));
            return message.channel.send(embed);
          }
          player.connect();
          player.set("voiceData", voiceData);
          player.set("member", message.member);
          embed.addField(musji.join + " " + message.translate("music/join:JOIN"), message.translate("music/join:BOUND", {
            voice: channel.id,
            text: message.channel.id
          }));
          return message.channel.send(embed);
        }
        if (player && channel.id !== player.voiceChannel) {
          embed.setDescription(musji.info + " " + message.translate("music/join:USED", {
            channel: player.voiceChannel
          }));
          return message.channel.send(embed);
        }
        if (player && channel.id === player.voiceChannel) {
          embed.setDescription(musji.yuhu + " " + message.translate("music/join:JOINED"));
          return message.channel.send(embed);
        }
    }
}
module.exports = Join;
