const Command = require("../../base/Command.js"),
    Discord = require("discord.js");

class BotsList extends Command {

    constructor(client) {
        super(client, {
            name: "bots-list",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["blist"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: true,
            cooldown: 5000
        });
    }

    async run(message, args, data) {

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        const bots = message.guild.members.cache.filter(member => member.user.bot);
        const botsname = bots.array();

        let description = botsname.map((b, i) => `**${i + 1}.** ${b.user.username}#${b.user.discriminator}`)
            .slice(0, 10)
            .join("\n");

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("common:BOTS_LIST"),  "https://tinyurl.com/y4xs3cje")
            .setColor(data.config.embed.color)
            .setTitle(`${message.translate("common:BOTS")}: ${bots.size}`)
            .setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(bots.size/10)}`)
            .setDescription(description);

        const msg = await message.channel.send(embed);

        await msg.react("⬅️");
        await msg.react("➡️");
        await msg.react("❌");

        const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async(reaction) => {

            if (reaction._emoji.name === "⬅️") {

                // Updates variables
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                // if there is no guild to display, delete the message
                if (i0 < 0) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                description = botsname.map((b, i) => `**${i + 1}** - ${b.user.username}`)
                    .slice(i0, i1)
                    .join("\n");

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.round(bots.size/10)}`)
                    .setDescription(description);

                // Edit the message 
                msg.edit(embed);

            }

            if (reaction._emoji.name === "➡️") {

                // Updates variables
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                // if there is no guild to display, delete the message
                if (i1 > bots.size + 10) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                description = botsname.map((b, i) => `**${i + 1}** - ${b.user.username}`)
                    .slice(i0, i1)
                    .join("\n");

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.round(bots.size/10)}`)
                    .setDescription(description);

                // Edit the message 
                msg.edit(embed);

            }

            if (reaction._emoji.name === "❌") {
                return msg.delete();
            }

            // Remove the reaction when the user react to the message
            await reaction.users.remove(message.author.id);

        });
    }

}

module.exports = BotsList;
