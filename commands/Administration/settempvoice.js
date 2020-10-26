const Command = require("../../base/Command.js");
const db = require("quick.db");

class Settempvoice extends Command {

    constructor(client) {
        super(client, {
            name: "settempvoice",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["settmpvc"],
            memberPermissions: ["MANAGE_GUILD"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        if (!message.member.voice.channel) return message.error("administration/settempvoice:ERROR");
        const options = {
            childCategory: message.member.voice.channel.parentID,
            childAutoDelete: true,
            childAutoDeleteIfOwnerLeaves: false,
            childBitrate: 8000,
            childFormat: (member) => `${member.nickname ? member.nickname : member.user.username}`
        };
        this.client.tempChannels.registerChannel(message.member.voice.channel.id, options);
        db.push("temp-channels", {
            channelID: message.member.voice.channel.id,
            options: options
        });
        message.success("administration/settempvoice:SUCCESS");
    }
}

module.exports = Settempvoice;
