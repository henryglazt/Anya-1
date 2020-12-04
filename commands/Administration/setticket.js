const Command = require("../../base/Command.js"),
	Resolvers = require("../../helpers/resolvers"),
		{ MessageEmbed } = require("discord.js");

class Setticket extends Command {

	constructor (client) {
		super(client, {
			name: "setticket",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [ "MANAGE_GUILD" ],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {


		if ((!args[0] || !["edit", "off"].includes(args[0])) && data.guild.plugins.tickets.enabled)
			return message.error("administration/setticket:MISSING_STATUS");

		if (args[0] === "off") {
			data.guild.plugins.tickets = {
				enabled: false,
				category: null,
				channel: null,
				role: null,
				logs: null
			};
			data.guild.markModified("plugins.tickets");
			data.guild.save();
			return message.error("administration/setticket:DISABLED", {
				prefix: data.guild.prefix
			});
		} else {
			const tickets = {
				enabled: true,
				category: null,
				channel: null,
				role: null,
				logs: null
			};

			const embed = new MessageEmbed()
				.setColor(data.config.embed.color)
				.setFooter(data.config.embed.footer)
				.setDescription(message.translate("administration/setticket:EMBED_DESC", {
					prefix: data.guild.prefix
				}));

			message.sendT("administration/setticket:FORM_1");
			const collector = message.channel.createMessageCollector(
				m => m.author.id === message.author.id,
				{
					time: 120000 // 2 minutes
				});

			collector.on("collect", async msg => {
				if (!tickets.category) {
					const category = await Resolvers.resolveChannel({
						message: msg,
						search: msg,
						channelType: "category"
					});
					if (!category) {
						return message.error("misc:INVALID_CATEGORY");
					}
					tickets.category = category.id;
					message.sendT("administration/setticket:FORM_2");
				}
				if (tickets.category && !tickets.role) {
					const role = await Resolvers.resolveRole({
						message: msg,
						search: msg
					});
					if (!role) {
						return message.error("misc:INVALID_ROLE");
					}
					tickets.role = role.id;
					message.sendT("aadministrator/setticket:FORM_3")
				}
				if (tickets.role && !tickets.logs) {
					const logs = await Resolvers.resolveChannel({
						message: msg,
						search: msg,
						channelType: "text"
					});
					if (!logs) {
						return message.error("misc:INVALID_CHANNEL");
					}
					tickets.logs = logs.id;
					data.guild.plugins.tickets = tickets;
					data.guild.markModified("plugins.tickets");
					await data.guild.save();
					const channel = await message.guild.channels.create("ticket-channel", {
						parent: tickets.category,
						permissionOverwrites: [{ allow: "VIEW_CHANNEL", id: message.guild.id }]
					});
					tickets.channel = channel.id;
					message.sendT("administration/setticket:FORM_SUCCESS", {
						channel: `<#${ticket.channel}>`,
						prefix: data.guild.prefix
					});
					channel.send(embed).catch((e) => message.error(e));
					return collector.stop();
				}
			});

			collector.on("end", (_, reason) => {
				if (reason === "time") {
					return message.error("misc:TIMES_UP");
				}
			});
		}
	}
}
module.exports = Setticket;
