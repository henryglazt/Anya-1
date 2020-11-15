module.exports = {
	token: "",
	supportURL: "https://discord.gg/gangsenggol",
	support: {
		id: "773707418482769982", // The ID of the support server
		logs: "773774472150646785", // And the ID of the logs channel of your server (new servers for example)
	},
	dashboard: {
		enabled: false, // whether the dashboard is enabled or not
		secret: "xxxxxx", // Your discord client secret
		baseURL: "https://localhost", // The base URl of the dashboard
		logs: "773774472150646785", // The channel ID of logs
		port: 8080, // Dashboard port
		expressSessionPassword: "xxxxxx", // Express session password (it can be what you want)
		failureURL: "" // url on which users will be redirected if they click the cancel button (discord authentication)
	},
	mongoDB: "mongodb+srv://anyageraldine:laililham@cluster0.efdfb.mongodb.net/anya?retryWrites=true&w=majority", // The URl of the mongodb database
	prefix: "??",
	embed: {
		color: "#f1c40f", // The default color for the embeds
		footer: "Anya Geraldine ~ Gang Sebelah © 2020" // And the default footer for the embeds
	},
	owner: {
		id: "339612673811415041", // The ID of the bot's owner
		name: "DooM™#1998" // And the name of the bot's owner
	},
	votes: {
		port: 5000, // The port for the server
		password: "", // The webhook auth that you have defined on discordbots.org
		channel: "" // The ID of the channel that in you want the votes logs
	},
	apiKeys: {
		// DBL: https://discordbots.org/api/docs#mybots
		dbl: "",
		// SENTRY: https://sentry.io (this is not required and not recommended)
		sentryDSN: ""
	},
	spotify: {
		id: "fd30a9e7da5b4fda8a2332a198ddbe5a",
		secret: "a017be619f154704882e2738b5c9f2df"
	},
	others: {
		github: "", // Founder's github account
		donate: "" // Donate link
	},
	languages: [
		{
			name: "en-US",
			nativeName: "English",
			moment: "en",
			defaultMomentFormat: "MMMM Do YYYY",
			default: true,
			aliases: [
				"English",
				"en",
				"en-us",
				"en_us",
				"en_US"
			]
		}
	]
};
