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
            if (message.channel.type !== "dm") {
                const prefixes = [
                    `<@!${message.client.user.id}> `,
                    `<@${message.client.user.id}> `,
                    message.client.user.username.toLowerCase(),
                    data.guild.prefix
                ];
                let prefix = null;
                prefixes.forEach((p) => {
                    if (message.content.startsWith(p) || message.content.toLowerCase().startsWith(p)) {
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
            if (channel) {
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
            return array.sort(function (a, b) {
                const x = a[key];
                const y = b[key];
                return ((x < y) ? 1 : ((x > y) ? -1 : 0));
            });
        },

        // This function return a shuffled array
        shuffle(pArray) {
            const array = [];
            pArray.forEach(element => array.push(element));
            let currentIndex = array.length,
                temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
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
            if (d) absoluteTime.push(d);
            if (h) absoluteTime.push(h);
            if (m) absoluteTime.push(m);
            if (s) absoluteTime.push(s);

            return absoluteTime.join(", ");
        },

        formatTime(milliseconds, minimal = false) {
            if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
                throw new RangeError("Utils#formatTime(milliseconds: number) Milliseconds must be a number greater than 0");
            }
            if (typeof minimal !== "boolean") {
                throw new RangeError("Utils#formatTime(milliseconds: number, minimal: boolean) Minimal must be a boolean");
            }
            const times = {
                years: 0,
                months: 0,
                weeks: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
            while (milliseconds > 0) {
                if (milliseconds - 31557600000 >= 0) {
                    milliseconds -= 31557600000;
                    times.years++;
                } else if (milliseconds - 2628000000 >= 0) {
                    milliseconds -= 2628000000;
                    times.months++;
                } else if (milliseconds - 604800000 >= 0) {
                    milliseconds -= 604800000;
                    times.weeks += 7;
                } else if (milliseconds - 86400000 >= 0) {
                    milliseconds -= 86400000;
                    times.days++;
                } else if (milliseconds - 3600000 >= 0) {
                    milliseconds -= 3600000;
                    times.hours++;
                } else if (milliseconds - 60000 >= 0) {
                    milliseconds -= 60000;
                    times.minutes++;
                } else {
                    times.seconds = Math.round(milliseconds / 1000);
                    milliseconds = 0;
                }
            }
            const finalTime = [];
            let first = false;
            for (const [k, v] of Object.entries(times)) {
                if (minimal) {
                    if (v === 0 && !first) {
                        continue;
                    }
                    finalTime.push(v < 10 ? `0${v}` : `${v}`);
                    first = true;
                    continue;
                }
                if (v > 0) {
                    finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
                }
            }
            let time = finalTime.join(minimal ? ":" : ", ");
            if (time.includes(",")) {
                const pos = time.lastIndexOf(",");
                time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
            }
            return time;
        },

        parseTime(time) {
            const regex = /\d+\.*\d*\D+/g;
            time = time.split(/\s+/).join("");
            let res;
            let duration = 0;
            while ((res = regex.exec(time)) !== null) {
                if (res.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                const local = res[0].toLowerCase();
                if (local.endsWith("seconds") || local.endsWith("second") || (local.endsWith("s") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 1000;
                } else if (local.endsWith("minutes") || local.endsWith("minute") || (local.endsWith("m") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 60000;
                } else if (local.endsWith("hours") || local.endsWith("hour") || (local.endsWith("h") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 3600000;
                } else if (local.endsWith("days") || local.endsWith("day") || (local.endsWith("d") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 86400000;
                } else if (local.endsWith("weeks") || local.endsWith("week") || (local.endsWith("w") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 604800000;
                } else if (local.endsWith("months") || local.endsWith("month")) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 2628000000;
                } else if (local.endsWith("years") || local.endsWith("year") || (local.endsWith("y") && local.match(/\D+/)[0].length === 1)) {
                    duration += parseInt(local.match(/\d+\.*\d*/)[0], 10) * 31557600000;
                }
            }
            if (duration === 0) {
                return null;
            }
            return duration;
        },
        formatDuration(durationObj) {
            const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${durationObj.minutes ? durationObj.minutes : '00'
                }:${(durationObj.seconds < 10)
                    ? ('0' + durationObj.seconds)
                    : (durationObj.seconds
                        ? durationObj.seconds
                        : '00')
                }`;
            return duration;
    }

};
