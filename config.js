module.exports = {
	/* The token of your Discord Bot */
	token: "",
	/* For the support server */
	support: {
		id: "718691607888789547", // The ID of the support server
		logs: "", // And the ID of the logs channel of your server (new servers for example)
	},
	/* Dashboard configuration */
	dashboard: {
		enabled: false, // whether the dashboard is enabled or not
		secret: "XXXXXXXXXXX", // Your discord client secret
		baseURL: "", // The base URl of the dashboard
		logs: "XXXXXXXXXXX", // The channel ID of logs
		port: 8080, // Dashboard port
		expressSessionPassword: "XXXXXXXXXXX", // Express session password (it can be what you want)
		failureURL: "" // url on which users will be redirected if they click the cancel button (discord authentication)
	},
	mongoDB: "mongodb+srv://anyageraldine:laililham@cluster0.efdfb.mongodb.net/anya?retryWrites=true&w=majority", // The URl of the mongodb database
	prefix: "??", // The default prefix for the bot
	/* For the embeds (embeded messages) */
	embed: {
		color: "#f1c40f", // The default color for the embeds
		footer: "Anya Geraldine ~ Gang Sebelah © 2020" // And the default footer for the embeds
	},
	/* Bot's owner informations */
	owner: {
		id: ["339612673811415041", "622047554359656473"], // The ID of the bot's owner
		name: ["DooM™#1998", "Dimas#6969"] // And the name of the bot's owner
	},
	/* DBL votes webhook (optional) */
	votes: {
		port: 5000, // The port for the server
		password: "", // The webhook auth that you have defined on discordbots.org
		channel: "" // The ID of the channel that in you want the votes logs
	},
	/* The API keys that are required for certain commands */
	apiKeys: {
		// DBL: https://discordbots.org/api/docs#mybots
		dbl: "",
		// SENTRY: https://sentry.io (this is not required and not recommended)
		sentryDSN: ""
	},
	/* The others utils links */
	others: {
		github: "", // Founder's github account
		donate: "" // Donate link
	},
	/* Language configuration */
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
