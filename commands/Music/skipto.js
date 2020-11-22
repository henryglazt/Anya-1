const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Skipto extends Command {
    constructor(client) {
        super(client, {
            name: "skipto",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "jump" ],
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

        let song = message.translate("common:SONG");
        let songs = message.translate("common:SONGS");
        let track = Number(args[0]);
        if (!track || isNaN(track) || track < 1 || track > player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skipto:VALUE", {
               max: player.queue.size
            }));
            return message.channel.send(embed);
        }
        if (track === 1) {
            await message.client.commands.get("skip").run(message, null, data);
        }
        if (track > 1 && player.queue.size !== track) {
            player.queue.splice(0, track - 1);
            player.stop();
            embed.addField(musji.next + " " + message.translate("music/skip:SUCCESS"), `**${track - 1 === 1 ? "1 " + `${song}` : `${track - 1}` + " " + `${songs}`}**`);
            return message.channel.send(embed);
        } else if (track > 1 && player.queue.size === track) {
            player.queue.splice(0, player.queue.length - 1);
            player.stop();
            embed.addField(musji.next + " " + message.translate("music/skip:SUCCESS"), `**${track - 1}` + " " + `${songs}**`);
            return message.channel.send(embed);
        }
    }
}
module.exports = Skipto;
