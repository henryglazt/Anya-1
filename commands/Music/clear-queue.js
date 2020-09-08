const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Clear-queue extends Command {

	constructor (client) {
		super(client, {
			name: "clear-queue",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "cq" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {



module.exports = Clear-queue;
