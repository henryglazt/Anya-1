const Command = require("../../base/Command.js"),
	Resolvers = require("../../helpers/resolvers"),
		{ MessageEmbed } = require("discord.js");

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
		const found = await Resolvers.resolveRole({
			message,
			search: tickets.role
		});
		if (!found) {
			return message.error("general/ticket:MISSING_ROLE");
		}
		const logsChannel = message.guild.channels.cache.get(tickets.logs);
		if (!logs) {
			return message.error("general/ticket:MISSING_CHANNEL");
		}

		const status = args[0];
		const reason = args.slice(1).join(" ");
		const ticket = data.memberData.ticket;
		if (!status) {
			return message.error("general/ticket:NO_STATUS");
		}
		if (!reason) {
			return message.error("general/ticket:NO_REASON");
		}
		if (reason.length > 20) {
			return message.error("general/ticket:LIMIT_CHAR");
		}

		if (status === "close") {
			if (ticket.resolved) {
				return message.error("general/ticket:RESOLVE_TRUE");
			}
			if

		} else if (status === "open" && reason) {
			if (!ticket.resolved) {
				return message.error("general/ticket:RESOLVE_FALSE");
			}

			const channel = await message.guild.channels.create(reason, {
				parent: data.guild.plugins.tickets.category,
				permissionOverwrites: [
					{ id: found, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] }
					{ id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] }
					{ id: message.guild.id, deny: "VIEW_CHANNEL" }
				]
			}).catch((e) => message.error(e));

			const ticket = {
				resolved = false,
				author = message.author.id,
				channel = channel.id
			}

			memberData.ticket = ticket;
			memberData.markModified("ticket");
			await memberData.save();

			const openEmbed = new MessageEmbed()
				.setColor(data.config.embed.color)
				.setFooter(data.config.embed.footer)
				.setDescription(message.translate("general/ticket:EMBED_DESC", {
					author: message.author.toString(),
					prefix: data.guild.prefix
				});

			channel.send(openEmbed);

			return message.success("general/ticket:SUCCESS", {
				channel: channel.toString()
			});
		}
	}
}
module.exports = Ticket;
