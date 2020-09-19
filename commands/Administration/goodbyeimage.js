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
        if (images.length === 1) {
            return message.error("administrator/goodbyeimage:MAX");
        }
        if (args[0] === "reset" && images.length > 0) {
            images.splice(0, 1);
            data.guild.save();
            return message.success("administrator/goodbyeimage:RESET");
        }
        if (!args[0] || !args[0].match(regex)) {
            return message.error("administrator/goodbyeimage:NO_ARGS");
        } else {
            images.push(args[0]);
            data.guild.save();
            return message.success("administrator/goodbyeimage:SUCCESS", {
                image: args[0]
            });
        }
    }
}
module.exports = Goodbyeimage;
