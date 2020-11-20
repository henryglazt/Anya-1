const Command = require("../../base/Command.js");

class Vcname extends Command {

    constructor(client) {
        super(client, {
            name: "vcname",
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

        const name = args.join(" ");

        if (!message.member.voice.channel) return message.sendT("voice:ERROR")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        if (!args[0]) return message.sendT("voice:ENAME")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
        message.member.voice.channel.setName(name);
        message.success("voice:SUCCESS")
            .then(m => {
                m.delete({
                    timeout: 5000
                })
            });
    }
}

module.exports = Vcname;
