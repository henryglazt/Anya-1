const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
class Join extends Command {
	constructor(client) {
		super(client, {
			name: "join",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["summon", "masuk"],
			memberPermissions: [],
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}
	async run(message, args, data) {
		const voice = message.member.voice.channel;
		if(!voice) {
			return message.error("music/play:NO_VOICE_CHANNEL");
		}
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
		return message.error("music/play:MY_VOICE_CHANNEL");
		}
		if(message.guild.me.voice.channel && message.member.voice.channel.id === message.guild.me.voice.channel.id) {
			return message.error("music/play:JOINED");
		}
		const perms = voice.permissionsFor(this.client.user);
		if(!perms.has("CONNECT") || !perms.has("SPEAK")) {
			return message.error("music/play:VOICE_CHANNEL_CONNECT");
		}
		voice.join().then(connection => {
			connection.voice.setSelfDeaf(true)
			message.channel.send({
				embed: {
					color: data.config.embed.color,
					footer: {
						text: data.config.embed.footer
					},
					description: this.client.customEmojis.success + " | " + message.translate("music/play:JOIN")
				}
			})
		});
	}
}
module.exports = Join;
