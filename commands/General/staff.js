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
            .setDescription([message.translate("general/staff:ADMINS") + "\n" + administrators.size > 0 ? administrators.map((a) => `${this.client.customEmojis.status[a.presence.status]} | ${a.user.tag.length < 25 ? escapeMarkdown(a.user.tag) : escapeMarkdown(a.user.username.substring(0, 25)) + " " + a.user.discriminator}`)
                    .join("\n") : message.translate("general/staff:NO_ADMINS") + "\n",
                message.translate("general/staff:MODS") + "\n" + moderators.size > 0 ? moderators.map((m) => `${this.client.customEmojis.status[m.presence.status]} | ${m.user.tag.length < 25 ? escapeMarkdown(m.user.tag) : escapeMarkdown(m.user.username.substring(0, 25)) + " " + m.user.discriminator}`)
                    .join("\n") : message.translate("general/staff:NO_MODS")]);

        return message.channel.send(embed);

    }

}

module.exports = Staff;
