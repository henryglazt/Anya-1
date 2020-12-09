"use-strict";

const Discord = require("discord.js");
module.exports = class {

	constructor (client) {
		this.client = client;
	}
  
	async run (oldMember, newMember) {
		if(oldMember.guild.id !== this.client.config.support.id) return;
		if(oldMember.roles.cache.some((r) => r.name === "【💳】Donators")) return;
		if(newMember.roles.cache.some((r) => r.name === "【💳】Donators")){
			const userData = await this.client.findOrCreateUser({ id: newMember.id });
			userData.achievements.tip.progress.now = 1;
			userData.achievements.tip.achieved = true;
			userData.markModified("achievements.tip");
			await userData.save();
			newMember.send({ files: [ { name: "unlocked.png", attachment: "./assets/img/achievements/achievement_unlocked5.png"} ] });
		}
		if (!oldMember.premiumSince && newMember.premiumSince) {
		const channel = newMember.guild.channels.cache.get("773711236117823509");
		const bembed = new Discord.MessageEmbed()
			.setColor("#f47fff")
			.setAuthor(`${newMember.displayName} just boosted the server!`, "https://cdn.discordapp.com/emojis/739595657123201125.gif")
			.setThumbnail(`${newMember.user.displayAvatarURL({ dynamic: true })}`)
			.setDescription(`Thank you ${newMember.user} for boosting the server.\nBecause of you, we are now have __**${newMember.guild.premiumSubscriptionCount}**__ boost in total.`)
			.setFooter(`Current Server Level: ${newMember.guild.premiumTier}`, "https://cdn.discordapp.com/emojis/739595657123201125.gif")
			.setTimestamp();
		channel.send(bembed).catch(console.error);
		}
		if (oldMember.premiumSince && !newMember.premiumSince) {
			newMember.roles.add("773868547444441111");
		}
	}
};
