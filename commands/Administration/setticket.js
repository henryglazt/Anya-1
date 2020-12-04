const Command = require("../../base/Command.js"),
	Resolvers = require("../../helpers/resolvers");

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


		if ((!args[0] || !["edit", "off"].includes(args[0])) && data.guild.plugins.ticket.enabled)
			return message.error("administration/setticket:MISSING_STATUS");

		if (args[0] === "off") {
			data.guild.plugins.ticket = {
				enabled: false,
				category: null,
				channel: null,
				role: null
			};
			data.guild.markModified("plugins.ticket");
			data.guild.save();
			return message.error("administration/setticket:DISABLED", {
				prefix: data.guild.prefix
			});
		} else {
			const ticket = {
				enabled: true,
				category: null,
				channel: null,
				role: null
			};
			message.sendT("administration/setticket:FORM_1");
			const collector = message.channel.createMessageCollector(
				m => m.author.id === message.author.id,
				{
					time: 180000 // 3 minutes
				});

			collector.on("collect", async msg => {
				if (!ticket.category) {
					const category = await Resolvers.resolveChannel({
						message: msg,
						search: msg,
						channelType: "category"
					});
					if (!category) {
						return message.error("misc:INVALID_CATEGORY");
					}
					ticket.category = category.id;
					message.sendT("administration/setticket:FORM_2");
				}
				if (ticket.category && !ticket.channel) {
					const channel = await Resolvers.resolveChannel({
						message: msg,
						search: msg,
						channelType: "text"
					});
					if (!channel) {
						return message.error("misc:INVALID_CHANNEL");
					}
					ticket.channel = channel.id;
					message.sendT("administration/setticket:FORM_3");
				}
				if (ticket.channel && !ticket.role) {
					const role = await Resolvers.resolveRole({
						message: msg,
						search: msg
					});
					if (!role) {
						return message.error("misc:INVALID_ROLE");
					}
					ticket.role = role.id;
					data.guild.plugins.ticket = ticket;
					data.guild.markModified("plugins.ticket");
					await data.guild.save();
					message.sendT("administration/setticket:FORM_SUCCESS", {
						channel: `<#${ticket.channel}>`
					});
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
