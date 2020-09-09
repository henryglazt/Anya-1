const Command = require("../../base/Command.js"),
	Discord = require("discord.js");
const filters = require("../../filters.json");

class Filter extends Command {

	constructor (client) {
		super(client, {
			name: "filter",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [],
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

		if(!this.client.player.isPlaying(message.guild.id)) {
			return message.error("music/play:NOT_PLAYING");
		}

		const filter = args[0];
		if(!filter) return message.channel.send(`Please specify a valid filter to enable or disable`);

		const filterToUpdate = Object.values(filters).find((f) => f.toLowerCase() === filter.toLowerCase());

		if(!filterToUpdate) return message.channel.send(`This filter doesn't exist`);

		const filterRealName = Object.keys(filters).find((f) => filters[f] === filterToUpdate);

		const queueFilters = this.client.player.getQueue(message.guild.id).filters
		const filtersUpdated = {};
		filtersUpdated[filterRealName] = queueFilters[filterRealName] ? false : true;
		this.client.player.setFilters(message.guild.id, filtersUpdated);

		if(filtersUpdated[filterRealName]) {

		message.channel.send(`I'm adding the filter to the music, please wait... Note : the longer the music is, the longer the wait will be`);

		} else {

		message.channel.send(`I'm disabling the filter on the music, please wait... Note : the longer the music is playing, the longer the wait will be`);
		}
	}

module.exports = Filter;
