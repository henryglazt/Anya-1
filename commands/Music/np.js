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

		const queue = this.client.player.getQueue(message.guild.id);

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}

		if(!queue){
			return message.error("music/play:NOT_PLAYING");
		}

		// Gets the current song
		const track = await this.client.player.nowPlaying(message.guild.id);

		// Generate discord embed to display song informations
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("music/np:CURRENTLY_PLAYING"))
			.setThumbnail(track.thumbnail)
			.addField(message.translate("music/np:T_TITLE"), track.name, true)
			.addField(message.translate("music/np:T_CHANNEL"), track.author, true)
			.addField(message.translate("music/np:T_DURATION"), message.convertTime(Date.now()+track.durationMS, "to", true), true)
			.addField(message.translate("music/np:T_DESCRIPTION"),
				track.description ?
					(track.description.substring(0, 150)+"\n"+(message.translate("common:AND_MORE").toLowerCase())) : message.translate("music/np:NO_DESCRIPTION"), true)
			.addField("\u200B", this.client.player.createProgressBar(message.guild.id))
			.setTimestamp()
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
        
		// Send the embed in the current channel
		message.channel.send(embed);
        
	}

}

module.exports = Nowplaying;
