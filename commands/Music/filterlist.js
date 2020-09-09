const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
const filters = require("../../filters.json");

class Filterlist extends Command {

	constructor (client) {
		super(client, {
			name: "filterlist",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "flist" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false,
			cooldown: 5000
		});
	}

	async run (message, args, data) {

		const voice = message.member.voice.channel;
		if (!voice){
			return message.error("music/play:NO_VOICE_CHANNEL");
		}
        
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
			return message.error("music/play:MY_VOICE_CHANNEL");
		}

		if(!client.player.isPlaying(message.guild.id))
			return message.error("music/play:NOT_PLAYING");
		}

		const enabledEmoji = "<a:ayes:744384533931098184>";
		const disabledEmoji = "<a:ano:744384493376503869>";

		const filtersStatuses = [ [], [] ];

		Object.keys(filters).forEach((filterName) => {
		    const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
		    array.push(filters[filterName] + " : " + (this.client.player.getQueue(message.guild.id).filters[filterName] ? enabledEmoji : disabledEmoji));
		    });

		const list = new Discord.MessageEmbed()
		    .setDescription(`List of all filters enabled or disabled.\nTo add a filter to a \`${data.guild.config.prefix}filter\` music.`)
		    .addField("**Filters**", filtersStatuses[0].join('\n'), true)
		    .addField("** **", filtersStatuses[1].join('\n'), true)
		    .setColor("ORANGE");

		message.channel.send(list);

module.exports = Filterlist;
