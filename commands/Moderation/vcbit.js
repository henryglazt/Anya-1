const Command = require("../../base/Command.js");

class Vcbitrate extends Command {

    constructor(client) {
        super(client, {
            name: "vcbitrate",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "vcbit" ],
            memberPermissions: [ "MANAGE_MESSAGES" ],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        if (message.deletable) message.delete();

        const bit = args[0];

        if (!message.member.voice.channel) return message.error("voice/main:ERROR")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        if (isNaN(args[0]) || !args[0] || args[0] > 384000) return message.error("voice/main:ENUM")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        message.member.voice.channel.setBitrate(bit);
        message.success(`Updated to ${bit}`)
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
    }
}

module.exports = Vcbitrate;
