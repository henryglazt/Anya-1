const Command = require("../../base/Command.js");

class Welcomeimage extends Command {

    constructor(client) {
        super(client, {
            name: "welcomeimage",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: ["MANAGE_GUILD"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        const regex = (/https?:\/\/.*\.(?:png|jpg)/g);
        const url = args[0].match(regex)[0];
        if (!args[0]) {
            return message.error("misc:NO_ARGS");
        }
        if (!url) {
            return message.error("misc:INVALID_URL");

        } else {
            data.guild.welcomeImage.push(url);
            data.guild.save();
            return message.success("administration/welcomeimage:IMAGE", {
                image: url
            });
        }
    }
}
module.exports = Welcomeimage;
