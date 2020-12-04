const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Ticket extends Command {

	constructor (client) {
		super(client, {
			name: "ticket",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "tiket" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 600000
		});
	}

	async run (message, args, data) {

		const tickets = data.guild.plugins.tickets;
		if (!tickets.enabled) {
			return message.error("general/ticket:DISABLED");
		}
		if (tickets.channel !== message.channel.id) {
			return message.error("general/ticket:WRONG_CHANNEL");
		}
		const status = args[0];
		const reason = args.slice(1).join(" ");
		if (!status) {
			return message.error("general/ticket:NO_STATUS");
		}
		if (status === "open") {
			if (!reason) {
				return message.error("general/ticket:NO_REASON");
			}
			if (reason.length > 20) {
				return message.error("general/ticket:LIMIT_CHAR");
			}
			const logsChannel = message.guild.channels.cache.get(tickets.logs);
			if (!logs) {
				return message.error("general/ticket:MISSING_CHANNEL");
			}

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.translate("general/report:TITLE", {
				user: member.user.tag
			}), message.author.displayAvatarURL())
			.addField(message.translate("common:AUTHOR"), message.author.tag, true)
			.addField(message.translate("common:DATE"), message.printDate(new Date(Date.now())), true)
			.addField(message.translate("common:REASON"), "**"+rep+"**", true)
			.addField(message.translate("common:USER"), `\`${member.user.tag}\` (${member.user.toString()})`, true)
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);

		const success = Discord.Util.parseEmoji(this.client.customEmojis.success).id;
		const error = Discord.Util.parseEmoji(this.client.customEmojis.error).id;
        
		repChannel.send(embed).then(async (m) => {
			await m.react(success);
			await m.react(error);
		});

		message.success("general/report:SUCCESS", {
			channel: repChannel.toString()
		});
	}

}

module.exports = Ticket;
