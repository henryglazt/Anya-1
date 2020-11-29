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
			cooldown: 5000
		});
	}

	async run (message, args, data) {

		if (message.guild.id !== "773707418482769982") {
			return message.error("general/confess:GS_ONLY");
		}
		if (message.guild) {
			return message.error("general/confess:DM_ONLY");
		}

		const confessChannel = client.channels.cache.get("782461424551067648");
		if(!confessChannel){
			return message.error("general/confess:MISSING_CHANNEL");
		}

		const confess = args.join(" ");
		if(!confess){
			return message.error("general/confess:MISSING_CONTENT");
		}

		let embed = new Discord.MessageEmbed()
			.setTitle(this.client.customEmojis.desc2 + " " + message.translate("general/confess:TITLE"))
			.setColor("RANDOM")
			.setFooter(message.translate("general/confess:ANON"))
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
