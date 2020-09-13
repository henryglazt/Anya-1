const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
class Autoplay extends Command {
	constructor(client) {
		super(client, {
			name: "autoplay",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: ["ap"],
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

module.exports = Autoplay;
