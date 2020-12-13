const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js"),
        { escapeMarkdown } = require("../../helpers/functions.js");

class Staff extends Command {

    constructor(client) {
        super(client, {
            name: "staff",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "stafflist" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        const guild = await message.guild.fetch();

        const administrators = guild.members.cache.filter((m) => m.hasPermission("ADMINISTRATOR") && !m.user.bot);
        const moderators = guild.members.cache.filter((m) => !administrators.has(m.id) && m.hasPermission("MANAGE_MESSAGES") && !m.user.bot);

        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
            .setAuthor(message.translate("general/staff:TITLE", {
                guild: message.guild.name
            }))
            .addField(message.translate("general/staff:ADMINS"), administrators.size <= 10 && administrators.size !== 0 ? administrators.map((a) => `${this.client.customEmojis.status[a.presence.status]} | ${escapeMarkdown(a.user.tag)}`)
                    .join("\n") : message.translate("general/staff:NO_ADMINS"))
            .addField(message.translate("general/staff:MODS"), moderators.size <= 10 && moderators.size !== 0 ? moderators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(m.user.tag)}`).slice(0, 10)
                    .join("\n") : message.translate("general/staff:NO_MODS"));

        if (administrators.size > 10 && administrators.size <= 20) {
            embed.addField(message.translate("general/staff:ADMINS"), administrators.size > 10 && administrators.size <= 20 ? administrators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(m.user.tag)}`).slice(10, 20).join("\n"));
        }

        if (moderators.size > 10 && moderators.size <= 20) {
            embed.addField(message.translate("general/staff:MODS"), moderators.size > 10 && moderators.size <= 20 ? moderators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(m.user.tag)}`).slice(10, 20).join("\n"));
        }

        if (administrators.size > 20 && administrators.size <= 30) {
            embed.addField(message.translate("general/staff:ADMINS"), administrators.size > 20 && administrators.size <= 30 ? administrators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(m.user.tag)}`).slice(20, 30).join("\n"));
        }

        if (moderators.size > 20 && moderators.size <= 30) {
            embed.addField(message.translate("general/staff:MODS"), moderators.size > 20 && moderators.size <= 30 ? moderators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(m.user.tag)}`).slice(20, 30).join("\n"));
        }

        return message.channel.send(embed);

    }

}

module.exports = Staff;
