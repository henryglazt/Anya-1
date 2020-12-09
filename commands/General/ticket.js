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
		if (!logsChannel) {
			return message.error("general/ticket:MISSING_CHANNEL");
		}

		const status = args[0];
		const reason = args.slice(1).join(" ");
		let ticket = data.memberData.ticket;
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

			let x;
			let att = [];
			let text = [];
			moment.locale("id");

			let msg = await message.channel.messages.fetch({ limit: 100 });

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
				await logsChannel.send(attachment);
				if (att.length > 0) logsChannel.send(att);
			}

			message.success("general/ticket:CLOSE", {
				channel: channel.toString()
			});

			let chToDel = await message.guild.channels.cache.get(memberData.ticket.channel);
			setTimeout(() => {
				chToDel.delete().catch((e) => message.error(e));
			}, 15000);

			ticket = {
				resolved: true,
				author: null,
				channel: null
			};

			data.memberData.markModified("ticket");
			await data.memberData.save();
			return;

		} else if (status === "open" && reason) {

			if (!ticket.resolved) {
				return message.error("general/ticket:RESOLVE_FALSE");
			}

			const channel = await message.guild.channels.create(reason, {
				parent: data.guild.plugins.tickets.category,
				permissionOverwrites: [
					{ id: message.guild.id, deny: "VIEW_CHANNEL" },
					{ id: found, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] },
					{ id: message.author.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES"] }
				]
			}).catch((e) => message.error(e));

			ticket = {
				resolved: false,
				author: message.author.id,
				channel: channel.id
			};

			data.memberData.markModified("ticket");
			await data.memberData.save();

			const openEmbed = new MessageEmbed()
				.setColor(data.config.embed.color)
				.setFooter(data.config.embed.footer)
				.setDescription(message.translate("general/ticket:EMBED_DESC", {
					author: message.author.toString(),
					prefix: data.guild.prefix
				}));

			channel.send(openEmbed);

			return message.success("general/ticket:OPEN", {
				channel: channel.toString()
			});

		}

	}

}

module.exports = Ticket;
