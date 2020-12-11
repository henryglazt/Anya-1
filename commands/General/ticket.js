const Command = require("../../base/Command.js"),
	fs = require("fs").promises,
		moment = require("moment"),
			Resolvers = require("../../helpers/resolvers"),
				{ MessageAttachment, MessageEmbed } = require("discord.js");

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
			cooldown: 20000
		});
	}

	async run (message, args, data) {

		await message.delete();

		const tickets = data.guild.plugins.tickets;
		if (!tickets.enabled) return message.error("general/ticket:DISABLED");

		const found = await Resolvers.resolveRole({
			message,
			search: tickets.role
		});
		if (!found) return message.error("general/ticket:MISSING_ROLE");

		const logsChannel = message.guild.channels.cache.get(tickets.logs);
		if (!logsChannel) return message.error("general/ticket:MISSING_CHANNEL");

		const status = args[0];
		let reason = args.slice(1).join(" ");

		if (!status) {

			const cmd = this.client.commands.get("ticket");
			const description = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:DESCRIPTION`);
			const usage = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:USAGE`, {
				prefix: message.guild
					? data.guild.prefix
					: ""
			});

			const examples = message.translate(`${cmd.help.category.toLowerCase()}/${cmd.help.name}:EXAMPLES`, {
				prefix: message.guild
					? data.guild.prefix
					: ""
			});

			const groupEmbed = new MessageEmbed()
				.setAuthor(message.translate("general/help:CMD_TITLE", {
					prefix: message.guild
						? data.guild.prefix
						: "",
						cmd: cmd.help.name
					}))
				.addField(message.translate("general/help:FIELD_DESCRIPTION"), description)
				.addField(message.translate("general/help:FIELD_USAGE"), usage)
				.addField(message.translate("general/help:FIELD_EXAMPLES"), examples)
				.addField(message.translate("general/help:FIELD_ALIASES"),
					cmd.help.aliases.length > 0
						? cmd.help.aliases.map(a => "`" + a + "`").join("\n")
						: message.translate("general/help:NO_ALIAS"))
				.addField(message.translate("general/help:FIELD_PERMISSIONS"),
					cmd.conf.memberPermissions.length > 0
						? cmd.conf.memberPermissions.map((p) => "`"+p+"`").join("\n")
						: message.translate("general/help:NO_REQUIRED_PERMISSION"))
				.setColor(data.config.embed.color)
				.setFooter(data.config.embed.footer);

			return message.channel.send(groupEmbed).then(m => {m.delete({timeout: 10000})});

		} else if (status === "close") {

			if (data.memberData.ticket.channel !== message.channel.id) return message.error("general/ticket:CLOSE_CHANNEL", {
				channel: `<#${data.memberData.ticket.channel}>`
			});

			if (!reason) reason = "No Reason";

			let x;
			let att = [];
			let text = [];
			moment.locale("id");

			let msg = await message.channel.messages.fetch({ limit: 100 }).catch((e) => message.error(e));

			msg.forEach(m => {
				x = m.attachments.map(a => a.proxyURL);
				if (x.length > 0) att.push(`from: ${m.author.tag} ${x}`);
				text.push(`${m.author.tag}:\n${m.content}\n${moment(m.createdTimestamp).format("L")} - ${moment(m.createdTimestamp).format("LT")}\n\n`);
			});

			att = att.join("\n");
			text = text.reverse().join("");

			let msgs = await fs.readFile("./transcript.txt", "utf8").catch(err => console.error(err));
			if (msgs) {
				await fs.writeFile("index.txt", text).catch(err => console.error(err));
				let attachment = new MessageAttachment("./index.txt", `Ticket ${message.author.tag}.txt`);
				await logsChannel.send(message.translate("general/ticket:CLOSED", {
					author: message.author.tag,
					case: `#${data.guild.plugins.tickets.case}`,
					id: message.author.id
					}), attachment);
				await message.author.send(message.translate("general/ticket:CLOSE"), attachment);
				if (att.length > 0) {
					logsChannel.send(att);
					message.author.send(att);
				}
			}

			let chToDel = await message.guild.channels.cache.get(data.memberData.ticket.channel);
			await chToDel.delete().catch((e) => message.error(e));

			data.memberData.ticket = {
				resolved: true,
				author: null,
				channel: null
			};

			data.memberData.markModified("ticket");
			await data.memberData.save();

			if (data.guild.plugins.modlogs) {
				const logsClose = message.guild.channels.cache.get(data.guild.plugins.modlogs);
				if (!logsClose) return;
				const logsCloseEmbed = new MessageEmbed()
					.errorColor()
					.setFooter(data.config.embed.footer)
					.setDescription(message.translate("general/ticket:CLOSE_LOGS", {
						author: message.author.tag,
						reason: reason,
						case: `#${data.guild.plugins.tickets.case}`,
						id: message.author.id
					}));
				return logsClose.send(logsCloseEmbed);
			}

		} else if (status === "open") {

			if (tickets.channel !== message.channel.id) return message.error("general/ticket:OPEN_CHANNEL", {
				channel: `<#${tickets.channel}>`
			});

			if (!data.memberData.ticket.resolved) return message.error("general/ticket:RESOLVE_FALSE");
			if (!reason) return message.error("general/ticket:NO_REASON");
			if (reason.length > 20) return message.error("general/ticket:LIMIT_CHAR");

			const channel = await message.guild.channels.create(reason, {
				parent: data.guild.plugins.tickets.category,
				permissionOverwrites: [
					{ id: message.guild.id, deny: "VIEW_CHANNEL" },
					{ id: found, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] },
					{ id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] }
				]
			}).catch((e) => message.error(e));

			data.memberData.ticket = {
				resolved: false,
				author: message.author.id,
				channel: channel.id
			};

			data.memberData.markModified("ticket");
			data.guild.plugins.tickets.case++;
			await data.memberData.save();
			await data.guild.save();

			const openEmbed = new MessageEmbed()
				.setColor(data.config.embed.color)
				.setFooter(data.config.embed.footer)
				.setDescription(message.translate("general/ticket:EMBED_DESC", {
					author: message.author.toString(),
					prefix: data.guild.prefix
				}));

			channel.send(openEmbed);

			if (data.guild.plugins.modlogs) {
				const logsOpen = message.guild.channels.cache.get(data.guild.plugins.modlogs);
				if (!logsOpen) return;
				const logsOpenEmbed = new MessageEmbed()
					.successColor()
					.setFooter(data.config.embed.footer)
					.setDescription(message.translate("general/ticket:OPEN_LOGS", {
						author: message.author.tag,
						reason: reason,
						case: `#${data.guild.plugins.tickets.case}`,
						id: message.author.id
					}));
				logsOpen.send(logsOpenEmbed);
			}

			return message.success("general/ticket:OPEN", {
				author: message.author.toString()
				channel: channel.toString()
			}).then(m => {m.delete({timeout: 10000})});

		}

	}

}

module.exports = Ticket;
