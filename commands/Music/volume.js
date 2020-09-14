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

		const embed = new Discord.MessageEmbed()
		.setColor(data.config.embed.color)
		.setFooter(data.config.embed.footer)

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

		let volume = parseInt(args[0])

		if(!args[0]){
			embed.setDescription(message.translate("music/volume:EXAMPLES"));
			return message.channel.send(embed);
		}
		if(isNaN(volume)){
			embed.setDescription(message.translate("music/volume:VALUE"));
			return message.channel.send(embed);
		}
		if(200 < volume){
			embed.setDescription(message.translate("music/volume:VALUE"));
			return message.channel.send(embed);
		}
		if(volume <=0){
			embed.setDescription(message.translate("music/volume:VALUE"));
			return message.channel.send(embed);
		}

		this.client.distube.setVolume(message, volume);

		message.channel.send({
			embed: {
				color: data.config.embed.color,
				footer: {
					text: data.config.embed.footer
				},
				description: message.translate("music/volume:SUCCESS", {volume: volume})
			}
		});
	}
}
module.exports = Volume;
