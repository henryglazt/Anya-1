module.exports = class {

	constructor (client) {
		this.client = client;
	}

	async run () {

		const client = this.client;

		// Logs some informations using the logger file
		client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "log");
		client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");

		/* DiscordBots.org STATS */
		const discordbotsorg = require("../helpers/discordbots.org.js");
		discordbotsorg.init(client);

		/* UNMUTE USERS */
		const checkUnmutes = require("../helpers/checkUnmutes.js");
		checkUnmutes.init(client);

		/* SEND REMINDS */
		const checkReminds = require("../helpers/checkReminds.js");
		checkReminds.init(client);

		// Start the dashboard
		if(client.config.dashboard.enabled){
			client.dashboard.load(client);
		}

		// Update the game every 20s
		status: [
			{
			name: "@mention to ??help",
			type: "LISTENING"
			},
			{
			name: `with ${client.users.cache.size} members,
			type: "PLAYING"
			},
			{
			name: "at discord.gg/gangsebelah",
			type: "PLAYING"
			}
			]
		let i = 0;
		setInterval(function(){
			const toDisplay = status[parseInt(i, 10)].name.replace("{serversCount}", client.guilds.cache.size)";
			client.user.setActivity(toDisplay, {type: status[parseInt(i, 10)].type});
			if(status[parseInt(i+1, 10)]) i++;
			else i = 0;
		}, 20000); // Every 20 seconds

	}
};  
