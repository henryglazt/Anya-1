const Command = require("../../base/Command.js");

class Reactionrole extends Command {

    constructor(client) {
        super(client, {
            name: "reactionrole",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "rr" ],
            memberPermissions: ["MANAGE_GUILD"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        const role = message.mentions.roles.first();
        if (!role)
            return message.reply('You need mention a role').then(m => m.delete({timeout: 10000}));
        const emoji = client.emojis.resolveIdentifier(args.slice(1)[0])
        if (!emoji)
            return message.reply('You need use a valid emoji.').then(m => m.delete({timeout: 10000}));
        const msg = await message.channel.messages.fetch(args.slice(2)[0] || message.id);
        if (!role)
            return message.reply('Message not found! Wtf...').then(m => m.delete({timeout: 10000}));
        reactionRoleManager.createReactionRole({
            message: msg,
            role,
            emoji
        });
        message.reply("Done").then(m => m.delete({timeout: 5000}));
    }
}

module.exports = Reactionrole;
