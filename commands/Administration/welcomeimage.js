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

        const images = data.guild.welcomeImage;
        const regex = (/https?:\/\/.*\.(?:png|jpg)/g);
        if (images.length === 4) {
            return message.error("misc:MAX");
        }
        if (!args[0]) {
            return message.error("misc:NO_ARGS");
        }
        let url = args[0].match(regex);
        url = url[0];
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
