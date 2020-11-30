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
		if(!confess){
			return message.error("general/confess:MISSING_CONTENT");
		}

		let embed = new Discord.MessageEmbed()
			.setTitle(this.client.customEmojis.desc2 + " " + message.translate("general/confess:TITLE"))
			.setColor("RANDOM")
			.setDescription(confess)
		if (embed.description.length >= 2048) {
			embed.description = `${embed.description.substr(0, 2045)}...`;
		}

		message.sendT("general/confess:PROMPT").then(() => {
			message.dmChannel.awaitMessages(filter, {max: 1, time: 15000, errors : ["time"]}).then(collected => {
				if (collected.toLowerCase() === message.translate("common:NO").toLowerCase()){
					embed.setFooter(message.translate("general/confess:ANON"));
					confessChannel.send(embed).catch(console.error);
					message.success("general/confess:SUCCESS", {
						channel: confessChannel.toString()
					});
				}
				if (collected.toLowerCase() === message.translate("common:YES").toLowerCase()){
					embed.setFooter(message.author.tag);
					confessChannel.send(embed).catch(console.error);
					message.success("general/confess:SUCCESS", {
						channel: confessChannel.toString()
					});
				}
			});
		});
	}
}
module.exports = Confess;
