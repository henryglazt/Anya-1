const Command = require("../../base/Command.js");

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
            childFormat: (member) => `${member.nickname}`
        };
        this.client.tempChannels.registerChannel(message.member.voice.channel.id, options);
        data.guild.tmpch = {
            channelID: message.member.voice.channel.id,
            options: options
        };
        data.guild.save();
        message.success("administration/settempvoice:SUCCESS");
    }
}

module.exports = Settempvoice;
