const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
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
        const xembed = new Discord.MessageEmbed()
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
	return message.channel.send(xembed);
	}
}
module.exports = Shuffle;
