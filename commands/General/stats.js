const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
		ms = require("ms"),
			os = require("os"),
				core = os.cpus()[0];

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
			.setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
			.setAuthor(message.translate("common:STATS"), "https://tinyurl.com/y4xs3cje")
			.addField(`**❯ ${message.translate("common:GENERAL")}:**`, [
			`**● ${message.translate("common:USERNAME")}:** ${this.client.user.tag}`,
			`**● ${message.translate("common:ID")}:** \`${this.client.user.id}\``,
			`**● ${message.translate("common:COMMANDS")}:** ${this.client.commands.size}`,
			`**● ${message.translate("common:SERVERS")}:** ${this.client.guilds.cache.size.toLocaleString()} `,
			`**● ${message.translate("common:USERS")}:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
			`**● Node.js:** \`v${process.versions.node}\``,
			`**● Discord.js:** \`v${Discord.version}\``,
			`**● ${message.translate("common:CREATION")} ${message.translate("common:DATE")}:** ${message.printDate(this.client.user.createdAt)}`,
 			`\u200b`
			])
    
			.addField(`**❯ ${message.translate("common:SYSTEM")}**`, [
		  		`**● ${message.translate("common:PLATFORM")}:** ${process.platform}`,
	  			`**● ${message.translate("common:UPTIME")}:** ${ms(os.uptime() * 1000, { long: true })}`,
	  			`**● ${message.translate("common:CPU")}:**`,
	  			`> **${message.translate("common:CORES")}:** \`${os.cpus().length}\``,
  				`> **${message.translate("common:MODEL")}:** \`${core.model}\``,
  				`> **${message.translate("common:SPEED")}:** \`${core.speed}MHz\``,
  				`**● ${message.translate("common:MEMORY")}:**`,
  				`> **${message.translate("common:HEAP")} ${message.translate("common:TOTAL")}:** \`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB\``,
  				`> **${message.translate("common:HEAP:")} ${message.translate("common:USED")}:** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``,
				`\u200b`
				])

			.addField(this.client.customEmojis.link+" "+message.translate("general/stats:LINKS_TITLE"), message.translate("misc:STATS_FOOTER", {
			inviteLink: await this.client.generateInvite({permissions: "ADMINISTRATOR"}),
			supportLink: this.client.config.supportURL
		}));
		message.channel.send(statsEmbed);
	}
}

module.exports = Stats;
