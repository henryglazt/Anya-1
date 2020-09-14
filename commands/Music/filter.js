const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
const filters = require("../../filters.json");

class Filter extends Command {

	constructor (client) {
		super(client, {
			name: "filter",
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

	async run (message, args, data) {

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}
        
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
			return message.error("music/play:MY_VOICE_CHANNEL");
		}

		if(!this.client.player.isPlaying(message.guild.id)) {
			return message.error("music/play:NOT_PLAYING");
		}

		if ([`3d`, `bassboost`, `echo`, `flanger`, `gate`, `haas`, `karaoke`, `nightcore`, `reverse`, `vaporwave`].includes(args[0])) {
		let filter = client.distube.setFilter(message, args[0]);
		message.channel.send("Current queue filter: " + (filter || "Off"));
		}
}

module.exports = Filter;
