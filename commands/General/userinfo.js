const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
		fetch = require("node-fetch");

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

		const mtr = message.translate;
		const emoji = this.client.customEmojis;
		let member = null;
		if(message.guild){
			member = await message.guild.members.fetch(user).catch(() => {});
		}

		const status = {"online": emoji.status.online + " " + mtr("common:STATUS_ONLINE"), "idle": emoji.status.idle + " " + mtr("common:STATUS_AFK"), 
				"dnd": emoji.status.dnd + " " + mtr("common:STATUS_DND"), "offline": emoji.status.offline + " " + mtr("common:STATUS_OFFLINE")};

		const embed = new Discord.MessageEmbed()
			.setAuthor(mtr("common:USER") + " " + mtr("common:INFO"), "https://tinyurl.com/y4xs3cje")
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addField(`**❯ ${mtr("common:USER")}:**`, [
			`**● ${mtr("common:USERNAME")}:** ${escapeMarkdown(user.username)}`,
			`**● ${mtr("common:DISCRIMINATOR")}:** \`#${user.discriminator}\``,
			`**● ${mtr("common:ID")}:** \`${user.id}\``,
			`**● ${mtr("common:STATUS")}:** ${status[user.presence.status]}`,
			`**● ${mtr("common:AVATAR")}:** 🔗 [${user.username}\`s ${mtr("common:AVATAR")}](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })})`,
			`**● ${mtr("common:CREATION")} ${mtr("common:DATE")}:** ${message.printDate(user.createdAt)}`,
			`\u200b`
			])
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
            
		if(member){
		const roles = member.roles.cache
		.sort((a, b) => b.position - a.position)
		.map(role => role.toString())
		.slice(0, -1);
			embed.addField`"**❯ mtr("common:MEMBER"):**`, [
			`**● ${mtr("common:NICKNAME")}:** ${member.nickname ? member.nickname : mtr("general/userinfo:NO_NICKNAME")}`,
			`**● ${mtr("common:HIGHEST")} ${mtr("common:ROLE")}:** ${member.roles.highest}`,
			`**● ${mtr("common:HEX")} ${mtr("common:COLOR")}:** \`${member.displayHexColor}\``,
			`**● ${mtr("common:ROLES")} [${roles.length}]:** ${roles.length < 16 && roles.length !== 0 ? roles.join(', ') : roles.length > 15 ? ('Too Many Roles!') : '`None`'}`,
			`**● ${mtr("common:JOIN")} ${mtr("common:DATE")}:** ${message.printDate(member.joinedAt)}`,
			`**● ${mtr("common:ACKNOWLEDGEMENTS")}:** ${member.guild.owner.id === member.user.id ? ('Server Owner') : member.hasPermission('ADMINISTRATOR') ? ('Server Admin') : '`None`'}`,
			`\u200b`
			])
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
