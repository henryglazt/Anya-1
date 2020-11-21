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
            embed.setDescription(musji.info + " " + message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player || !player.playing || !player.paused || player.queue.totalSize === 0) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        const volume = Number(args[0]);
        if (volume < 1 || volume > 100) {
            embed.setDescription(musji.info + " " + message.translate("music/volume:VALUE"));
            return message.channel.send(embed);
        }
        if (!volume || volume === player.volume) {
            embed.setDescription(musji.vol + " " + message.translate("music/volume:SET", {volume: player.volume}));
            return message.channel.send(embed);
        }
        if (volume > player.volume) {
            embed.setDescription(musji.volup + " " + message.translate("music/volume:SUCCESS", {volume: volume}));
        } else {
            embed.setDescription(musji.voldown + " " + message.translate("music/volume:SUCCESS", {volume: volume}));
        }
        player.setVolume(volume);
        return message.channel.send(embed);
    }
}
module.exports = Volume;
