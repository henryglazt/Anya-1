const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Vcuser extends Command {

	constructor (client) {
		super(client, {
			name: "vcuser",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 3000
		});
	}

	async run (message, args, data) {

    const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
    let count = 0;
  
    for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

    const vcmbd = new Discord.MessageEmbed()
    .setColor(data.config.embed.color)
    .addField(`Total member in voice channels:`, `<a:giphy_3:744676992141623399> ${count}`)
    .setFooter(this.client.user.username)
    message.channel.send(vcmbd);
   }
}

module.exports = Vcuser;
