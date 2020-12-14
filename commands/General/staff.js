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

        const administrators = await guild.members.cache.filter((m) => m.hasPermission("ADMINISTRATOR") && !m.user.bot);
        const moderators = await guild.members.cache.filter((m) => !administrators.has(m.id) && m.hasPermission("MANAGE_MESSAGES") && !m.user.bot);

        let admin = [];
        let mod = [];
        let al;
        let ml;

        if (administrators.size > 0) {
            administrators.forEach((a) => {
                al = a.user.username;
                if (al.length > 20) al = al.substring(0, 20);
                admin.push(`${this.client.customEmojis.status[a.presence.status]} | ${escapeMarkdown(al)}#${a.user.discriminator}\n`);
            });
        } else {
            admin = message.translate("general/staff:NO_ADMINS");
        };

        if (moderators.size > 0) {
            moderators.forEach((m) => {
                ml = m.user.username;
                if (ml.length > 20) ml = ml.substring(0, 20);
                mod.push(`${this.client.customEmojis.status[m.presence.status]} | ${escapeMarkdown(ml)}#${m.user.discriminator}\n`);
            });
        } else {
            mod = message.translate("general/staff:NO_MODS");
        };

        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
            .setAuthor(message.translate("general/staff:TITLE", {
                guild: message.guild.name
            }))
            .setDescription(`${message.translate("general/staff:ADMINS")}\n${admin}\n`);//${message.translate("general/staff:MODS")}\n${mod}`);

        return message.channel.send(embed);

    }

}

module.exports = Staff;
