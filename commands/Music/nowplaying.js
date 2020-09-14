const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Nowplaying extends Command {

	constructor (client) {
		super(client, {
			name: "nowplaying",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "np" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {

		const queue = this.client.distube.getQueue(message);

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}

		if(!queue){
			return message.error("music/play:NOT_PLAYING");
		}

		// Gets the current song
		const track = await this.client.distube.isPlaying(message);

		// Generate discord embed to display song informations
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("music/np:CURRENTLY_PLAYING"))
			.setThumbnail(track.thumbnail)
			.addField(message.translate("music/np:T_TITLE"), track.name, true)
			.addField(message.translate("music/np:T_CHANNEL"), track.author, true)
			.addField(message.translate("music/np:T_DURATION"), message.convertTime(Date.now()+track.duration, "to", true), true)
			.setTimestamp()
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
        
		// Send the embed in the current channel
		message.channel.send(embed);
        
	}

}

module.exports = Nowplaying;
