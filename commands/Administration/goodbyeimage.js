const Command = require("../../base/Command.js");

class Goodbyeimage extends Command {

    constructor(client) {
        super(client, {
            name: "goodbyeimage",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["gimg"],
            memberPermissions: ["MANAGE_GUILD"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        const images = data.guild.goodbyeImage;
        const regex = (/https?:\/\/.*\.(?:png|jpg)/g);
        if (images.length === 4) {
            return message.error("misc:MAX");
        }
        if (args[0] === "reset" && images.length > 0) {
            images.splice(0, 4);
            data.guild.save();
            return message.success("administrator/goodbyeimage:RESET");
        }
        if (!args[0]) {
            return message.error("misc:NO_ARGS");
        }
        if (!args[0].match(regex)) {
            return message.error("misc:INVALID_URL");
        } else {
            images.push(args[0]);
            data.guild.save();
            return message.success("administration/goodbyeimage:IMAGE", {
                image: args[0]
            });
        }
    }
}
module.exports = Goodbyeimage;
