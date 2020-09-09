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

		if(!this.client.player.isPlaying(message.guild.id))
			return message.error("music/play:NOT_PLAYING");
		}

		const repeatModeEnabled = this.client.player.getQueue(message.guild.id).repeatMode;
		if (repeatModeEnabled) {
		this.client.player.setRepeatMode(message.guild.id, false);
		message.sendT("music/repeat:DISABLED");
		} else {
		this.client.player.setRepeatMode(message.guild.id, true);
		message.sendT("music/repeat:ENABLED");
		}
  
		this.client.player.nowPlaying(message.guild.id);
		}

module.exports = Repeat;
