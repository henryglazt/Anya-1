const Command = require("../../base/Command.js");

class Resume extends Command {

	constructor (client) {
		super(client, {
			name: "resume",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message) {

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}
        
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
			return message.error("music/play:MY_VOICE_CHANNEL");
		}

		if(!this.client.distube.isPlaying(message)) {
			return message.error("music/play:NOT_PLAYING");
		}

		if(!this.client.distube.isPaused(message)) {
			return message.error("music/resume:NOT_PAUSED");
		}

		this.client.distube.resume(message);

		message.channel.send({
			embed: {
				color: data.config.embed.color,
				footer: {
					text: data.config.embed.footer
				},
				description: message.translate("music/resume:SUCCESS")
			}
		});
	}
}
module.exports = Resume;
