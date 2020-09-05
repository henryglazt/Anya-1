const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Serverinfo extends Command {

	constructor (client) {
		super(client, {
			name: "leave",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        
		let guild = message.guild;

		if(args[0]){
			let found = this.client.guilds.cache.get(args[0]);
			if(!found){
				found = this.client.cache.guilds.find((g) => g.name === args.join(" "));
				if(found){
					guild = found;
				}
			}
		}

		guild = await guild.fetch();

		guild.leave();
	}

}

module.exports = "Leave";
