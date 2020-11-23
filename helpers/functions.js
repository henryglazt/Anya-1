const languages = require("../config").languages.map((l) => l.moment).filter((l) => l !== "en");
languages.forEach((l) => {
	require(`moment/locale/${l}.js`);
});
module.exports = {
	/**
	 * Gets message prefix
	 * @param {object} message The Discord message
	 * @returns The prefix
	 */
	getPrefix(message, data) {
			if(message.channel.type !== "dm") {
				const prefixes = [`<@!${message.client.user.id}> `, `<@${message.client.user.id}> `,
					message.client.user.username.toLowerCase(),
					data.guild.prefix
				];
				let prefix = null;
				prefixes.forEach((p) => {
					if(message.content.startsWith(p) || message.content.toLowerCase().startsWith(p)) {
						prefix = p;
					}
				});
				return prefix;
			} else {
				return true;
			}
		},
		// This function return a valid link to the support server
		async supportLink(client) {
			const guild = client.guilds.cache.get(client.config.support.id);
			const member = guild.me;
			const channel = guild.channels.cache.find((ch) => ch.permissionsFor(member.id).has("CREATE_INSTANT_INVITE"));
			if(channel) {
				const invite = await channel.createInvite({
					maxAge: 0
				}).catch(() => {});
				return invite ? invite.url : null;
			} else {
				return "discord.gg/gangsebelah";
			}
		},
		// This function sort an array 
		sortByKey(array, key) {
			return array.sort(function(a, b) {
				const x = a[key];
				const y = b[key];
				return((x < y) ? 1 : ((x > y) ? -1 : 0));
			});
		},
		// This function return a shuffled array
		shuffle(pArray) {
			const array = [];
			pArray.forEach(element => array.push(element));
			let currentIndex = array.length,
				temporaryValue, randomIndex;
			// While there remain elements to shuffle...
			while(0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		},
		// This function return a random number between min and max
		randomNum(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		},
		convertTime(guild, time) {
			const absoluteSeconds = Math.floor((time / 1000) % 60);
			const absoluteMinutes = Math.floor((time / (1000 * 60)) % 60);
			const absoluteHours = Math.floor((time / (1000 * 60 * 60)) % 24);
			const absoluteDays = Math.floor(time / (1000 * 60 * 60 * 24));
			const d = absoluteDays ? absoluteDays === 1 ? guild.translate("time:ONE_DAY") : guild.translate("time:DAYS", {
				amount: absoluteDays
			}) : null;
			const h = absoluteHours ? absoluteHours === 1 ? guild.translate("time:ONE_HOUR") : guild.translate("time:HOURS", {
				amount: absoluteHours
			}) : null;
			const m = absoluteMinutes ? absoluteMinutes === 1 ? guild.translate("time:ONE_MINUTE") : guild.translate("time:MINUTES", {
				amount: absoluteMinutes
			}) : null;
			const s = absoluteSeconds ? absoluteSeconds === 1 ? guild.translate("time:ONE_SECOND") : guild.translate("time:SECONDS", {
				amount: absoluteSeconds
			}) : null;
			const absoluteTime = [];
			if(d) absoluteTime.push(d);
			if(h) absoluteTime.push(h);
			if(m) absoluteTime.push(m);
			if(s) absoluteTime.push(s);
			return absoluteTime.join(", ");
		},
		formatTime(time) {
			const seconds = Math.floor((time / 1000) % 60);
			const minutes = Math.floor((time / (1000 * 60)) % 60);
			const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
			const duration = `${hours ? (hours + ':') : ''}${(minutes < 10) ? ('0' + minutes) : (minutes ? minutes : '00')}:${(seconds < 10) ? ('0' + seconds) : (seconds ? seconds : '00')}`;
			return duration;
		},
		parseTime(time) {
			const regex = /\d+\.*\d*\D+/g;
			time = time.split(/\s+/).join("");
			let res;
			let duration = 0;
			while((res = regex.exec(time)) !== null) {
				if(res.index === regex.lastIndex) {
					regex.lastIndex++;
				}
				const local = res[0].toLowerCase();
				if(local.endsWith("seconds") || local.endsWith("second") || (local.endsWith("s") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 1000;
				} else if(local.endsWith("minutes") || local.endsWith("minute") || (local.endsWith("m") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 60000;
				} else if(local.endsWith("hours") || local.endsWith("hour") || (local.endsWith("h") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 3600000;
				} else if(local.endsWith("days") || local.endsWith("day") || (local.endsWith("d") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 86400000;
				} else if(local.endsWith("weeks") || local.endsWith("week") || (local.endsWith("w") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 604800000;
				} else if(local.endsWith("months") || local.endsWith("month")) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 2628000000;
				} else if(local.endsWith("years") || local.endsWith("year") || (local.endsWith("y") && local.match(/\D+/)[0].length === 1)) {
					duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 31557600000;
				}
			}
			if(duration === 0) {
				return null;
			}
			return duration;
		},
		escapeMarkdown(text) {
			var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1'); // unescape any "backslashed" character
			var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1'); // escape *, _, `, ~, \
			return escaped;
		},
		arrMove(input, from, to) {
			let elmDel = 1;
			const elm = input.splice(from, elmDel)[0];
			elmDel = 0;
			return input.splice(to, elmDel, elm);
		},
		arrSwap(input, from, to) {
			let elmDell = 1;
			return input.splice(from, elmDell, input.splice(to, elmDell, input[from])[0]);
		}
};
