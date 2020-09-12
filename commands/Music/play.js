const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Play extends Command {

	constructor (client) {
		super(client, {
			name: "play",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "p" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) { 

		const voice = message.member.voice.channel;
		if(!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}

		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
			return message.error("music/play:MY_VOICE_CHANNEL");
		}

		const string = args.join(" ");
		if(!string){
			return message.error("music/play:MISSING_SONG_NAME");
		}
    
		const perms = voice.permissionsFor(this.client.user);
		if(!perms.has("CONNECT") || !perms.has("SPEAK")){
			return message.error("music/play:VOICE_CHANNEL_CONNECT");
		}
    
		try {
		this.client.distube.play(message, string)
		} catch (e) {
		message.error(`Error: \`${e}\``)
		}
	}
}

module.exports = Play;
