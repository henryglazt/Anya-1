const Discord = require("discord.js");

module.exports = class {

	constructor (client) {
		this.client = client;
	}
    
	async run (guild) {
        
		const embed = new Discord.MessageEmbed()
			    .setColor("#ff0000")
			    .setAuthor("I've been removed from:", guild.iconURL({dynamic: true}))
			    .setDescription(
			    	`**Guild Name:** ${guild.name}\n**Guild ID:** (\`${guild.id}\`)\nThis guild has \`${guild.memberCount}\` members!`
			    )
			    .setFooter(`Now connected to ${client.guilds.cache.size} guilds`)
			    .setTimestamp();
		this.client.channels.cache.get(this.client.config.support.logs).send(embed);

	}
};
