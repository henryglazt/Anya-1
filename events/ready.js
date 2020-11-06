const CronJob = require("cron").CronJob;

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run() {

        const client = this.client;

        client.manager.init(client.user.id);

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
        if (client.config.dashboard.enabled) {
            client.dashboard.load(client);
        }

        // Update the game every 20
        const status = [
            {
                name: "@mention to ??help",
                type: "LISTENING"
			},
            {
                name: `with ${client.users.cache.size} members`,
                type: "PLAYING"
			},
            {
                name: "at discord.gg/gangsebelah",
                type: "PLAYING"
			}
			]
        let i = 0;
        setInterval(function () {
            const toDisplay = status[parseInt(i, 10)].name.replace("{serversCount}", client.guilds.cache.size);
            client.user.setActivity(toDisplay, {
                type: status[parseInt(i, 10)].type
            });
            if (status[parseInt(i + 1, 10)]) i++;
            else i = 0;
        }, 20000);

        const cmds = {
            "Groovy 1": "-play",
            "Groovy 2": "--play",
            "Groovy 3": "---play",
            "Rythm 1": "rplay",
            "Rythm 2": "rrplay",
            "Rythm 3": "rrrplay",
            "Chip 1": "c1.play",
            "Chip 2": "c2.play",
            "Chip 3": "c3.play",
            "Jockie 1": "j.play",
            "Jockie 2": "j.play",
            "Jockie 3": "j.play",
            "Jockie 4": "j.play",
            "GSMusic1": "gs1.play",
            "GSMusic2": "gs2.play",
            "GSMusic3": "gs3.play",
            "GSMusic4": "gs4.play",
            "Anya": "??play",
            "Awkarin": "aw.play",
            "Octave 1": "o1.play",
            "Octave 2": "o2.play",
            "Unbelievaboat": "un.play",
            "MEE6": "!play",
            "Pancake": "p!play",
            "Bongo": "b.play",
            "Probot": "p.play",
            "Fredboat": ";;play",
            "ZeroDay": "!!play",
            "Momo": "//play",
            "Izumi": "iz.play",
            "Icarus": "ic!play",
            "Ear": "earplay",
            "Purity": "pur!",
            "Botify": "bo.play",
            "Manuvera": "÷play",
            "Atlas": "a!play",
            "Macaw": "m!play"
        }

        const array = [];
        Object.entries(cmds).forEach(([key, value]) => {
            array.push(`${key}${" ".repeat(20 - key.length)}::   ${value}`);
        });

        let guild = client.guilds.cache.get("773707418482769982");
        let channel = guild.channels.cache.get("773712559530311723");

        var job = new CronJob(
            "0 0 * * * *",
            function () {
                channel.send(`= GANG SEBELAH MUSIC BOTS COMMANDS =\n\n${array.join("\n")}`, {
                    code: "asciidoc"
                });
            },
            null,
            true,
            "Asia/Jakarta"
        );

    }
};
