const Command = require("../../base/Command.js");

class Welcomeimage extends Command {

    constructor(client) {
        super(client, {
            name: "welcomeimage",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["wimg"],
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
        if (images.length === 3) {
            return message.error("administration/welcomeimage:MAX");
        }
        if (args[0] === "reset" && images.length > 0) {
            images.splice(0, 3);
            data.guild.save();
            return message.success("administration/welcomeimage:RESET");
        }
        if (!args[0] || !args[0].match(regex)) {
            return message.error("administration/welcomeimage:NO_ARGS");
        } else {
            images.push(args[0]);
            data.guild.save();
            return message.success("administration/welcomeimage:SUCCESS", {
                image: args[0]
            });
        }
    }
}
module.exports = Welcomeimage;
