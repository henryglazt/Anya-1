const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Confess extends Command {

	constructor (client) {
		super(client, {
			name: "confess",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "curhat" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 180000
		});
	}

	async run (message, args, data) {

		if (message.guild) {
			return message.error("general/confess:DM_ONLY");
		}

		const confessChannel = await this.client.channels.fetch("782478711533862962");
		if(!confessChannel){
			return message.error("general/confess:MISSING_CHANNEL");
		}

		let confess = args.join(" ");
		let footer = message.author.tag;
		if(!confess){
			return message.error("general/confess:MISSING_CONTENT");
		} 
		if (args[0].toLowerCase() === "anon") {
			confess = args.slice(1).join(" ");
			footer = message.translate("general/confess:ANON");
		}

		let embed = new Discord.MessageEmbed()
			.setTitle(this.client.customEmojis.desc2 + " " + message.translate("general/confess:TITLE"))
			.setColor("RANDOM")
			.setFooter(footer)
			.setDescription(confess)
		if (embed.description.length >= 2048) {
			embed.description = `${embed.description.substr(0, 2045)}...`;
		}

		confessChannel.send(embed).catch(console.error);
		message.success("general/confess:SUCCESS", {
			channel: confessChannel.toString()
		});
	}
}
module.exports = Confess;
