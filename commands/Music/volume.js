const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Volume extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["vol"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        
    const player = message.client.manager.players.get(message.guild.id);

    if(!player) return message.channel.send(idioma.volume.nada)

    const { channel } = message.member.voice

    if(!channel) return message.channel.send(idioma.volume.conectar)

    if(channel.id !== player.voiceChannel) return message.channel.send(idioma.player.conectar2)

    const volume = Number(args[0]);
    if (!volume || volume < 1 || volume > 100) return message.reply(idioma.volume.invalido);
    player.setVolume(volume);
    return message.reply(idioma.volume.mudado + player.volume);


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
