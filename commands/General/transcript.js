const Command = require("../../base/Command.js"),
	fs = require("fs"),
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

        msg.forEach(m => {
           text.push(`${m.author.tag} | ${moment(m.createdTimestamp).format("lll")} | ${m.content}`)
        });
        text = text.reverse();

	let data = await fs.readFile("./transcript.txt", "utf8", (err, data));
	if (err) throw err;
	if (data) {
		await fs.writeFile("index.txt", text).catch((e) => console.error(e));
		let attachment = new MessageAttachment("./index.txt", `Ticket ${message.author.tag}`)
		return message.channel.send(attachment);
	}
	}
};
module.exports = Transcript;
