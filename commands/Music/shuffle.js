const Command = require("../../base/Command.js"),
	{ MessageEmbed } = require("discord.js");
class Shuffle extends Command {
	constructor(client) {
		super(client, {
			name: "shuffle",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["acak"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
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
        if (!player) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (player.queue.size <= 2) {
            embed.setDescription(musji.info + " " + message.translate("music/shuffle:MIN_QUEUE"));
            return message.channel.send(embed);
        }
        player.queue.shuffle();
        embed.setDescription(musji.shuffle + " " + message.translate("music/shuffle:SUCCESS"));
        return message.channel.send(embed);

        /*const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)

        const queue = this.client.distube.getQueue(message);
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
        if (!queue.songs[2]) {
            xembed.setDescription(message.translate("music/shuffle:MIN_QUEUE"));
            return message.channel.send(xembed);
        }
	this.client.distube.shuffle(message);
	xembed.setDescription(message.translate("music/shuffle:SUCCESS"));
	return message.channel.send(xembed);*/
	}
}
module.exports = Shuffle;
