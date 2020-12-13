const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
        Resolvers = require("../../helpers/resolvers");

class Takerole extends Command {

    constructor(client) {
        super(client, {
            name: "takerole",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "trole" ],
            memberPermissions: [ "MANAGE_ROLES" ],
            botPermissions: [ "MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }

    async run(message, args, data) {

        if (!args.length) return message.error("moderation/takerole:NO_ARGS");

        let member;
        let role;

        try {
            member = await Resolvers.resolveMember({
                message,
                search: args[0]
            });
            role = await Resolvers.resolveRole({
                message,
                search: args[1]
            });

            if (!member) return message.error("moderation/takerole:NO_MEMBER");
            if (!role) return message.error("moderation/takerole:NO_ROLE");

            const emoji = this.client.customEmojis;
            const embed = new MessageEmbed()

            if (!member.roles.cache.has(role.id)) {
                embed.errorColor()
                embed.setDescription(emoji.error + " " + message.translate("moderation/takerole:HAS_ROLE", {
                      member: member.user.toString(),
                      role: role.toString()
                }));
                return message.channel.send(embed)
            } else {
                embed.successColor()
                embed.setDescription(emoji.success + " " + message.translate("moderation/takerole:SUCCESS", {
                      member: member.user.toString(),
                      role: role.toString()
                }));
                await member.roles.remove(role.id)
                    .then(() => message.channel.send(embed))
                    .catch(err => message.error(err));
                return;
            }
        } catch (e) {
            return message.error(e);
        }
    }
}

module.exports = Takerole;
