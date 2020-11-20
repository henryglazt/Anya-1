const Command = require("../../base/Command.js");

class Vclimit extends Command {

    constructor(client) {
        super(client, {
            name: "vclimit",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: ["MANAGE_MESSAGES"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        if (message.deletable) message.delete();

        const limit = args[0];

        if (!message.member.voice.channel) return message.error("voice:ERROR")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        if (isNaN(args[0]) || !args[0] || args[0] > 99) return message.error("voice:ENUM")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        message.member.voice.channel.setUserLimit(limit);
        message.success("voice:SUCCESS")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
    }
}

module.exports = Vclimit;
