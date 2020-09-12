const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Repeat extends Command {

	constructor (client) {
		super(client, {
			name: "repeat",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "loop", "ulang" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {

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

		let mode = null;
		switch (args[0]) {
		case "off":
		mode = 0
		break
		case "song":
		mode = 1
		break
		case "queue":
		mode = 2
		break
		}
		mode = this.client.distube.setRepeatMode(message, mode);
		mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
		message.success("music/shuffle:MODE");
		}
	}

module.exports = Repeat;
