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

    const voiceChannels = message.guild.channels.cache.filter(c => c.type === "voice");
    let count = 0;
    let user = 0;
    let bot = 0;
  
    for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
    for (const [id, voiceChannel] of voiceChannels) user += voiceChannel.members.filter(m => !m.user.bot).size;
    for (const [id, voiceChannel] of voiceChannels) bot += voiceChannel.members.filter(m => m.user.bot).size;

    const vcmbd = new Discord.MessageEmbed()
    .setColor(data.config.embed.color)
    .setAuthor(message.guild.name + " members in voice channels")
    .addField("User:", `<a:giphy_3:744676992141623399> ${user}`)
    .addField("Bot:", `<a:giphy_3:744676992141623399> ${bot}`)
    .addField("Total:", `<a:giphy_3:744676992141623399> ${count}`)
    .setFooter(data.config.embed.footer)
    message.channel.send(vcmbd);
   }
}
module.exports = Vcuser;
