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
        let text = new Collection();
        let msgs = await message.channel.messages.fetch({ limit: 100 });//.then(messages => {
        text = text.concat(msgs); console.log(text);
        let reversed = text.array().reverse();
        let data = await fs.readFileSync('./transcript.txt', 'utf8')
        if (data) {
                reversed.forEach(async msg => {
                    let dateString = `${moment(msg.createdTimestamp).calendar()}`;
                    msg += `${msg.author.tag} at ${dateString}: ${msg.content}\n`;
                await fs.writeFileSync("index.txt", msg).catch(() => {});
                })
                let attachment = new MessageAttachment("./index.txt", `${message.author.tag}-tickets.txt`);
                return message.channel.send(attachment);
        }
           /* }).catch(err => {
                console.log(`Failed to fetch messages: ${err}`);
            });

        /*let messageCollection = new Collection();
        let channelMessages = await message.channel.messages.fetch({
            limit: 100
        }).catch(err => console.log(err));

let dateString = `${moment(value.createdTimestamp).calendar()}`;

                    text += `${value.author.tag} at ${dateString}: ${value.content}\n`;

                }

        messageCollection = messageCollection.concat(channelMessages);

        while(channelMessages.size === 100) {
            let lastMessageId = channelMessages.lastKey();
            channelMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
            if(channelMessages)
                messageCollection = messageCollection.concat(channelMessages);
        }
        let msgs = messageCollection.array().reverse();

        if (data) {
            //await fs.writeFile('index.txt', data).catch(err => console.log(err));
            msgs.forEach(async msg => {
                await fs.writeFile('index.txt', msg).catch(err => console.log(err));
            });
            let attachment = new MessageAttachment("./index.txt", `${message.author.tag}-tickets.txt`);
            return message.channel.send(attachment);
	}*/
	}
};
module.exports = Transcript;
