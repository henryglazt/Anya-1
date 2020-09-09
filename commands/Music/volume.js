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

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}
        
		const queue = this.client.player.getQueue(message.guild.id);

		if(!queue){
			return message.error("music:play:NOT_PLAYING");
		}

		await this.client.player.setVolume(message.guild.id, parseInt(args[0]));

		message.sendT("music/volume:SUCCESS");


module.exports = Volume;
