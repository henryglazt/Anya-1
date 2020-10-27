const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Takerole extends Command {

	constructor (client) {
		super(client, {
			name: "takerole",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "trole" ],
			memberPermissions: [ "MANAGE_ROLES" ],
			botPermissions: [ "MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {

  if (!args[0]) return message.error("Please specify the user and the role!").then(
    msg => {msg.delete({timeout: 10000})
           });
  if (!args.slice(1).join(" ")) return message.error("Please specify the role!").then(
    msg => {msg.delete({timeout: 10000})
           });
  try {
  let member = message.mentions.members.first() || await message.guild.members.fetch({user: args[0], force: true});
  let role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.slice(1).join(" ").toLowerCase()) || 
             message.guild.roles.cache.find((r) => r.id === args[1]) || message.mentions.roles.last();
  if (!role) return message.error("I couldn't find that role!").then(
    msg => {msg.delete({timeout: 10000})
           });
  
  const embed = new Discord.MessageEmbed()
  
  if (!member.roles.cache.has(role.id)) {
      embed.setColor("#f44c44")
      embed.setDescription(`<a:ano:744384493376503869> ${member.user} doesn't have the ${role} role`);
    message.channel.send(embed)
  } else {
      embed.setColor("#44a474")
      embed.setDescription(`<a:ayes:744384533931098184> ${role} role is removed from ${member.user}`);
    await member.roles.remove(role.id)
    .then(() => message.channel.send(embed))
    .catch(err => message.error(`Something went wrong... ${err} or Probably the ${role.name} role is higher than my role.`));
  }
  } catch(e) {
    return message.error(`Something went wrong... ${e}.`);
  }
}
}

module.exports = Takerole;
