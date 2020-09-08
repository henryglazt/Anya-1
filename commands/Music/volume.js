const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Volume extends Command {

	constructor (client) {
		super(client, {
			name: "volume",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "vol" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {



module.exports = Volume;
