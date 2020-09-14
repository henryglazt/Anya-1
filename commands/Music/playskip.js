const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
class Playskip extends Command {
	constructor(client) {
		super(client, {
			name: "playskip",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["insert"],
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
		if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
			return message.error("music/play:MY_VOICE_CHANNEL");
		}
		if(!this.client.distube.isPlaying(message)) {
			return message.error("music/play:NOT_PLAYING");
		}
		const string = args.join(" ");
		if(!string) {
			return message.error("music/play:MISSING_SONG_NAME");
		}
		try {
			this.client.distube.playSkip(message, string)
		} catch(e) {
			message.error(`Error: \`${e}\``)
		}
	}
}
module.exports = Playskip;
