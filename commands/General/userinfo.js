const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
		fetch = require("node-fetch"),
			{ escapeMarkdown } = require("../../helpers/functions");

class Userinfo extends Command {

	constructor (client) {
		super(client, {
			name: "userinfo",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "ui" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {
        
		let displayPresence = true;

		const isID = !isNaN(args[0]);

		var user;
		if(!args[0]){
			user = message.author;
		}
		if(message.mentions.users.first()){
			user = message.mentions.users.first();
		}
		if(isID && !user){
			user = this.client.users.cache.get(args[0]);
			if(!user){
				user = await this.client.users.fetch(args[0], true).catch(() => {});
				displayPresence = false;
			}
		}
        
		if(!user){
			return message.error("general/userinfo:INVALID_USER");
		}

		const emoji = this.client.customEmojis;
		let member = null;
		if(message.guild){
			member = await message.guild.members.fetch(user).catch(() => {});
		}

		const status = {"online": `${emoji.status.online} ${message.translate("common:STATUS_ONLINE")}`, "idle": `${emoji.status.idle} ${message.translate("common:STATUS_IDLE")}`, 
				"dnd": `${emoji.status.dnd} ${message.translate("common:STATUS_DND")}`, "offline": `${emoji.status.offline} ${message.translate("common:STATUS_OFFLINE")}`};

		const embed = new Discord.MessageEmbed()
			.setAuthor(`${message.translate("common:USER_INFO")}`, "https://tinyurl.com/y4xs3cje")
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addField(`**❯ ${message.translate("common:USER")}:**`, [
			`**● ${message.translate("common:USERNAME")}:** ${escapeMarkdown(user.username)}`,
			`**● ${message.translate("common:DISCRIMINATOR")}:** \`#${user.discriminator}\``,
			`**● ${message.translate("common:ID")}:** \`${user.id}\``,
			`**● ${message.translate("common:STATUS")}:** ${status[user.presence.status]}`,
			`**● ${message.translate("common:AVATAR")}:** 🔗 [${user.username}\`s ${message.translate("common:AVATAR")}](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })})`,
			`**● ${message.translate("common:CREATION_DATE")}:** ${message.printDate(user.createdAt)}`,
			`\u200b`
			])
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
            
		if(member){
		const roles = member.roles.cache
		.sort((a, b) => b.position - a.position)
		.map(role => role.toString())
		.slice(0, -1);
			embed.addField(`**❯ ${message.translate("common:MEMBER")}:**`, [
			`**● ${message.translate("common:NICKNAME")}:** ${member.nickname ? `${escapeMarkdown(member.nickname)}` : `\`${message.translate("common:NONE")}\``}`,
			`**● ${message.translate("common:HIGHEST_ROLE")}:** ${roles.length ? roles[0] : `\`${message.translate("common:NONE")}\``}`,
			`**● ${message.translate("common:HEX_COLOR")}:** \`${member.displayHexColor}\``,
			`**● ${message.translate("common:ROLES")} [${roles.length}]:** ${roles.length < 16 && roles.length !== 0 ? roles.join(", ") : roles.length > 15 ? `${roles.slice(0, 14).join(", ")} \`${message.translate("common:AND_MORE")}\`` : `\`${message.translate("common:NONE")}\``}`,
			`**● ${message.translate("common:JOIN_DATE")}:** ${message.printDate(member.joinedAt)}`,
			`**● ${message.translate("common:ACKNOWLEDGEMENTS")}:** ${member.guild.owner.id === member.user.id ? `${message.translate("common:SERVER_OWNER")}` : member.hasPermission('ADMINISTRATOR') ? `${message.translate("common:SERVER_ADMIN")}` : `\`${message.translate("common:NONE")}\``}`,
			`\u200b`
			]);
		}

		if(user.bot && this.client.config.apiKeys.dbl && (this.client.config.apiKeys.dbl !== "")){
			const res = await fetch("https://discordbots.org/api/bots/"+user.id, {
				headers: { "Authorization": this.client.config.apiKeys.dbl }
			});
			const data = await res.json();
			if(!data.error){
				embed.addField(this.client.customEmojis.desc+" "+message.translate("common:DESCRIPTION"), data.shortdesc, true)
					.addField(this.client.customEmojis.stats+" "+message.translate("common:STATS"), message.translate("general/userinfo:BOT_STATS", {
						votes: data.monthlyPoints || 0,
						servers: data.server_count || 0,
						shards: (data.shards || [0]).length,
						lib: data.lib || "unknown"
					}), true)
					.addField(this.client.customEmojis.link+" "+message.translate("common:LINKS"), 
						`${data.support ? `[${message.translate("common:SUPPORT")}](${data.support}) | ` : ""}${data.invite ?  `[${message.translate("common:INVITE")}](${data.invite}) | ` : ""}${data.github ?  `[GitHub](${data.github}) | ` : ""}${data.website ?  `[${message.translate("common:WEBSITE")}](${data.website})` : ""}`
						, true);
			}
		}

		message.channel.send(embed);
	}

}

module.exports = Userinfo;
