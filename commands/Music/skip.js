const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Skip extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "next", "s", "lanjut" ],
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
        if (!player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }
        let song = player.queue.current;
        player.stop();
        embed.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`);
        embed.addField(musji.next + " " + message.translate("music/skip:SUCCESS"), `[${song.title}](${song.uri})`);
        return message.channel.send(embed)
    }
}
module.exports = Skip;
