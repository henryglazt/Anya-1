const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
	const ms = require('ms');
	const os = require('os');
	const core = os.cpus()[0];

class Stats extends Command {

	constructor (client) {
		super(client, {
			name: "stats",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "statistics", "infobot", "botinfos", "bot-infos", "bot-info", "infos-bot", "info-bot" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {

		const statsEmbed = new Discord.MessageEmbed()
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer)
			.setAuthor(message.translate("common:STATS"), "https://tinyurl.com/y4xs3cje")
			.addField("**❯ General:**", [
			`**● Username:** ${this.client.user.tag}`,
			`**● ID:** ${this.client.user.id}`,
			`**● Commands:** ${this.client.commands.size}`,
			`**● Servers:** ${this.client.guilds.cache.size.toLocaleString()} `,
			`**● Users:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
			`**● Channels:** ${this.client.channels.cache.size.toLocaleString()}`,
			`**● Node.js:** v${process.version}`,
			`**● Discord.js:** v${djsversion}`,
			`**● Creation Date:** ${message.printDate(createdAt)}`,
 			`\u200b`
			])
    
			.addField("**❯ System**", [
		  		`**● Platform:** ${process.platform}`,
	  			`**● Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
	  			`**● CPU:**`,
	  			`> **Cores:** ${os.cpus().length}`,
  				`> **Model:** ${core.model}`,
  				`> **Speed:** ${core.speed}MHz`,
  				`**● Memory:**`,
  				`> **Heap Total:** ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
  				`> **Heap Used:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
				`\u200b`
				])
			/*.addField(this.client.customEmojis.stats+" "+message.translate("general/stats:COUNTS_TITLE"), message.translate("general/stats:COUNTS_CONTENT", {
				servers: this.client.guilds.cache.size,
				users: this.client.users.cache.size
			}), true)
			.addField(this.client.customEmojis.version+" "+message.translate("general/stats:VERSIONS_TITLE"), `\`Discord.js : v${Discord.version}\`\n\`Nodejs : v${process.versions.node}\``, true)
			.addField(this.client.customEmojis.ram+" "+message.translate("general/stats:RAM_TITLE"), `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``, true)
			.addField(this.client.customEmojis.status.online+" "+message.translate("general/stats:ONLINE_TITLE"), message.translate("general/stats:ONLINE_CONTENT", {
				time: message.convertTime(Date.now()+this.client.uptime, "from", true)
			}))*/

			.addField(this.client.customEmojis.link+" "+message.translate("general/stats:LINKS_TITLE"), message.translate("misc:STATS_FOOTER", {
			inviteLink: await this.client.generateInvite("ADMINISTRATOR"),
			supportLink: "https://discord.gg/gangsebelah"
		})
		);
		message.channel.send(statsEmbed);

	}

}

module.exports = Stats;
