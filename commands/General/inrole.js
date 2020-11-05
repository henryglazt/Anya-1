const Command = require("../../base/Command.js"),
    Discord = require("discord.js"),
        Resolvers = require("../../helpers/resolvers");

class Inrole extends Command {

    constructor(client) {
        super(client, {
            name: "inrole",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "ir" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(message, args, data) {

        await message.delete();

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        if (!args.slice()
            .length >= 1) return message.error("general/inrole:NO_ARGS");

        const role = await Resolvers.resolveRole({
            message,
            search: args.slice().join(" ")
        });

        if (!role) return message.error("general/inrole:NOT_FOUND")
            .then(
                msg => {
                    msg.delete({
                        timeout: 10000
                    })
                });
        const inRole = role.members.array();
        const array = [];
        inRole.forEach((member) => {
            array.push(member.user.tag);
        });
        if (!array.length) return message.error("general/inrole:NO_MEMBERS");
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("general/inrole:ROLE", {
                roleName: role.name
            }), "https://tinyurl.com/y4xs3cje")
            .setColor(data.config.embed.color)
            .setTitle(message.translate("general/inrole:MEMBERS", {
                members: array.length
            }))
            .setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(array.length/10)}`)
            .setDescription(array.slice(0, 10)
                .join("\n"));

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

                // if there is no member to display, delete the message
                if (i0 < 0) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.round(array.length/10)}`)
                    .setDescription(array.slice(i0, i1)
                        .join("\n"));

                // Edit the message 
                msg.edit(embed);

            }

            if (reaction._emoji.name === "➡️") {

                // Updates variables
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                // if there is no member to display, delete the message
                if (i1 > array.length + 10) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.round(array.length/10)}`)
                    .setDescription(array.slice(i0, i1)
                        .join("\n"));

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

module.exports = Inrole;
