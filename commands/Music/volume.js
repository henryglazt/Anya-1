const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Volume extends Command {

	constructor (client) {
		super(client, {
			name: "volume",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "vol" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
    
		let volume = parseInt(args[0])

		if(!args[0]) return message.sendT("music/vol:EXAMPLES");
		if(isNaN(volume)) return message.error("music/vol:INVALID");
		if(200 < volume)  return message.error("music/vol:INVALID");
		if(volume <=0) return message.error("music/vol:INVALID");


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

		this.client.distube.setVolume(message, volume);

		message.sendT("music/volume:SUCCESS");
		}
	}

module.exports = Volume;
