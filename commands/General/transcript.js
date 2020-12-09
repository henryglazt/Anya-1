const Command = require("../../base/Command.js"),
	fs = require("fs").promises,
		moment = require("moment"),
			{ MessageAttachment } = require("discord.js");

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

		let att = [];
		let text = [];
		let msg = await message.channel.messages.fetch({ limit: 100 });

		moment.locale("id");

                msg.forEach(m => {
			let x = m.attachments.map(a => a.proxyURL);
			if (x.length > 0) att.push(x);
			text.push(`${m.author.tag}:\nMessage: ${m.content}\nAttacments:n${moment(m.createdTimestamp).format("L")} - ${moment(m.createdTimestamp).format("LT")}\n\n`);
                });

		att = att.join("\n");
		text = text.reverse().join("");

		let data = await fs.readFile("./transcript.txt", "utf8").catch(err => console.error(err));
		if (data) {
			await fs.writeFile("index.txt", text).catch(err => console.error(err));
			let attachment = new MessageAttachment("./index.txt", `Ticket ${message.author.tag}.txt`);
			if (att.length > 0) message.channel.send(att);
			return message.channel.send(attachment);
		}

	}

};

module.exports = Transcript;
