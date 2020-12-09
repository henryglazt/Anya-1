const Command = require("../../base/Command.js"),
	fs = require("fs").promises,
		moment = require("moment"),
			{ Collection, MessageAttachment } = require("discord.js");

class Transcript extends Command {

	constructor (client) {
		super(client, {
			name: "transcript",
			dirname: __dirname,
			enabled: true,
			guildOnly: false,
			aliases: [ "tr" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES" ],
			nsfw: false,
			ownerOnly: true,
			cooldown: 1000
		});
	}

	async run (message) {

                await message.delete();

                let text = [];
                let msg = await message.channel.messages.fetch({ limit: 100 });

		moment.locale("id");

                msg.forEach(m => {
                      text.push(`${m.author.tag}:\n${m.content}\n${moment(m.createdTimestamp).format("L")}-${moment(m.createdTimestamp).format("LT")}\n\n`);
                });

                text = text.reverse();

		let data = await fs.readFile("./transcript.txt", "utf8").catch(err => console.error(err));
		if (data) {
			await fs.writeFile("index.txt", text).catch(err => console.error(err));
			let attachment = new MessageAttachment("./index.txt", `Ticket ${message.author.tag}.txt`);
			return message.channel.send(attachment);
		}

	}

};

module.exports = Transcript;
