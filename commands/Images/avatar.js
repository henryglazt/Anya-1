const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Avatar extends Command {
	constructor (client) {
		super(client, {
			name: "avatar",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args) {

                const status = {'online': '<:online:741196747748933682>', 'idle': '<:idle:741197218861678644>', 
        	   		'dnd': '<:dnd:741196524238667846>', 'offline': '<:offline:741197268123648020>'};

		let user = await this.client.resolveUser(args[0]);
		if(!user) user = message.author;
		const embed = new Discord.MessageEmbed()
   		 .setColor("#8300ff")
 		 .addField(`${status[user.presence.status]} ${user.tag}`, `\`ID: ${user.id}\``, true)
  		 .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }))
  		 .setFooter("NuruAruvi")
  		message.channel.send(embed);

	}

}

module.exports = Avatar;
