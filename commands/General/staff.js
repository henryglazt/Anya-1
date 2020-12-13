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

        let admin;
        let mods;

        if (administrators.size > 0) {
            admin = administrators.map((a) => {
                let al = a.user.username;
                if (al.length > 25) al = al.substring(0, 25);
                `${this.client.customEmojis.status[a.presence.status]} | ${escapeMarkdown(al)} ${a.user.discriminator}`
            }).join("\n");
        } else {
            message.translate("general/staff:NO_ADMINS");
        };

        if (moderators.size > 0) {
            mods = moderators.map((m) => {
                let ml = m.user.username;
                if (ml.length > 25) ml = ml.substring(0, 25);
                `${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(ml)} ${m.user.discriminator}`
            }).join("\n");
        } else {
            message.translate("general/staff:NO_MODS");
        };

        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
            .setAuthor(message.translate("general/staff:TITLE", {
                guild: message.guild.name
            }))
            .setDescription([
                `${message.translate("general/staff:ADMINS")} ${admins}`,
                `${message.translate("general/staff:MODS")} ${mods}`
            ]);

        return message.channel.send(embed);

    }

}

module.exports = Staff;
