const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "hapus" ],
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

        let track = Number(args[0]);
        let song = player.queue[track - 1];
        if (!track || isNaN(track) || track < 1 || track > player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skipto:VALUE", {
               max: player.queue.size
            }));
            return message.channel.send(embed);
        }
        if (track >= 1 && player.queue.size !== track) {
            player.queue.splice(track - 1, 1);
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`);
            embed.addField(musji.remove + " " + message.translate("music/remove:SUCCESS"), `[${song.title}](${song.uri})`);
            return message.channel.send(embed);
        } else if (track >= 1 && player.queue.size === track) {
            player.queue.splice(player.queue.length - 1, 1);
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`);
            embed.addField(musji.remove + " " + message.translate("music/remove:SUCCESS"), message.translate("music/nowplaying:SONG", {
               songName: song.title,
               songURL: song.uri
            }));
            return message.channel.send(embed);
        }
    }
}
module.exports = Remove;
