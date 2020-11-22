const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
    { formatTime } = require("../../helpers/functions.js");
class Nowplaying extends Command {
    constructor(client) {
        super(client, {
            name: "nowplaying",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "np" ],
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
        if (!player || !player.queue.current) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }

        let track = player.queue.current;
        let description;

        if (track.isStream) {
            description = musji.live1 + musji.live2;
        } else {
            const part = Math.floor((player.position / track.duration) * 30);
            description = `${'─'.repeat(part) + musji.gs + '─'.repeat(30 - part)}\n\n\`${formatTime(player.position)} / ${formatTime(track.duration)}\``;
        };

        embed.setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`);
        embed.setDescription(`[${track.title}](${track.uri})` + "\n\n" + description);
        embed.setAuthor(message.translate("music/play:NOW_PLAYING"), "https://cdn.discordapp.com/attachments/733966113167245312/778819885596934184/25629.png");
        return message.channel.send(embed);
    }
}
module.exports = Nowplaying;
