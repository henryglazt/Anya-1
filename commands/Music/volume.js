const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Volume extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "vol" ],
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
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player) {
            embed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        const volume = Number(args[0]);
        if (!volume || volume < 1 || volume > 100) {
            embed.setDescription(message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        player.setVolume(volume);
        if (volume > player.volume) {
            embed.setDescription(musji.volup + " " + message.translate("music/volume:SUCCESS", {volume: player.volume}));
        } else {
            embed.setDescription(musji.voldown + " " + message.translate("music/volume:SUCCESS", {volume: player.volume}));
        }
        return message.channel.send(embed);


/*      const embed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const voice = message.member.voice.channel;
        if (!voice) {
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!this.client.distube.isPlaying(message)) {
            embed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        let volume = parseInt(args[0])
        if (!args[0]) {
            embed.setDescription(message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        if (isNaN(volume)) {
            embed.setDescription(message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        if (200 < volume) {
            embed.setDescription(message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        if (volume <= 0) {
            embed.setDescription(message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        this.client.distube.setVolume(message, volume);
        embed.setDescription(message.translate("music/volume:SUCCESS", {
            volume: volume
        }));
        return message.channel.send(embed);*/
    }
}
module.exports = Volume;
