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

		let text = [];
		let att = [];
		let x;

		let msg = await message.channel.messages.fetch({ limit: 100 });

		moment.locale("id");

                msg.forEach(m => {
			x = m.attachments.map(a => a.proxyURL);
			if (x.length > 0) att.push(`from: ${m.author.tag} ${x}`);
			text.push(`${m.author.tag}:\n${m.content}\n${moment(m.createdTimestamp).format("L")} - ${moment(m.createdTimestamp).format("LT")}\n\n`);
                });

		att = att.join("\n");
		text = text.reverse().join("");

		let data = await fs.readFile("./transcript.txt", "utf8").catch(err => console.error(err));
		if (data) {
			await fs.writeFile("index.txt", text).catch(err => console.error(err));
			let attachment = new MessageAttachment("./index.txt", `Ticket ${message.author.tag}.txt`);
			await message.channel.send(attachment);
			if (att.length > 0) message.channel.send(att);
			return;
		}

	}

};

module.exports = Transcript;
