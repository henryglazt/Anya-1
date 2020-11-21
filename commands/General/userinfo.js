const Command = require("../../base/Command.js"),
	Discord = require("discord.js"),
	fetch = require("node-fetch"),
	{ convertTime } = require("../../helpers/functions.js");

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

		let member = null;
		if(message.guild){
			member = await message.guild.members.fetch(user).catch(() => {});
		}

		const status = {'online': '<:online:741196747748933682> Online', 'idle': '<:idle:741197218861678644> Idle', 
				'dnd': '<:dnd:741196524238667846> DND', 'offline': '<:offline:741197268123648020> Offline'};

		const embed = new Discord.MessageEmbed()
			.setAuthor("USER INFO", "https://tinyurl.com/y4xs3cje")
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addField("**❯ User:**", [
			`**● Username:** ${user.username}`,
			`**● Discriminator:** \`#${user.discriminator}\``,
			`**● ID:** \`${user.id}\``,
			`**● Status:** ${status[user.presence.status]}`,
			`**● Avatar:** 🔗 [${user.username}\`s Avatar](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })})`,
			`**● Created Date:** ${message.printDate(user.createdAt)} \`${this.client.convertTime(user.createdAt)}\``,
			`\u200b`
			])
			/*.addField(":man: "+message.translate("common:USERNAME"), user.username, true)
			.addField(this.client.customEmojis.discriminator+" "+message.translate("common:DISCRIMINATOR"), user.discriminator, true)
			.addField(this.client.customEmojis.bot+" "+message.translate("common:ROBOT"), (user.bot ? message.translate("common:YES") : message.translate("common:NO")), true)
			.addField(this.client.customEmojis.calendar+" "+message.translate("common:CREATION"), message.printDate(user.createdAt), true)
			.addField(this.client.customEmojis.avatar+" "+message.translate("common:AVATAR"), user.displayAvatarURL())*/
			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);
            
		if(member){
		const roles = member.roles.cache
		.sort((a, b) => b.position - a.position)
		.map(role => role.toString())
		.slice(0, -1);
			embed.addField("**❯ Member:**", [
			`**● Nickname:** ${member.nickname ? member.nickname : message.translate("general/userinfo:NO_NICKNAME")}`,
			`**● Highest Role:** ${member.roles.highest ? member.roles.highest : message.translate("general/userinfo:NO_ROLE")}`,
			`**● Hex Color:** \`${member.displayHexColor}\``,
			`**● Roles [${roles.length}]:** ${roles.length < 16 && roles.length !== 0 ? roles.join(', ') : roles.length > 15 ? ('Too Many Roles!') : '`None`'}`,
			`**● Joined Date:** ${message.printDate(member.joinedAt)}`,
			`**● Acknowledgements:** ${member.guild.owner.id === member.user.id ? ('Server Owner') : member.hasPermission('ADMINISTRATOR') ? ('Server Admin') : '`None`'}`,
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
