const Command = require("../../base/Command.js"),
    Discord = require("discord.js");

class Queue extends Command {

    constructor(client) {
        super(client, {
            name: "queue",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["q"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }

    async run(message, args, data) {

        const queue = this.client.distube.getQueue(message.guild.id);

        if (!queue) {
            return message.error("music/play:NOT_PLAYING");
        }
        const q = queue.songs.slice(1)
            .map((song, i) => {
                return `**${i+1}.** [${song.name}](${song.url}) - \`${song.duration == 0 ? "◉ LIVE" : song.formattedDuration}\` - ${song.user}`
            });

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        const current = queue.songs[0];
        let description = `[${current.name}](${current.url}) - \`${current.duration == 0 ? "◉ LIVE" : current.formattedDuration}\` - ${current.user}\n\`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\n`;
        description = description += q.slice(0, 10)
            .join("\n");

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/queue:TITLE"), "https://cdn.discordapp.com/emojis/598167786195517440.png")
            .setTitle(message.translate("music/np:NOW_PLAYING"))
            .setColor(data.config.embed.color)
            .setThumbnail(current.thumbnail)
            .setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(queue.songs.length/10)} | ${message.translate("music/queue:SONGS", {totalSongs: queue.songs.length})} | ${queue.formattedDuration}`)
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

                let description = `[${current.name}](${current.url}) - \`${current.duration == 0 ? "◉ LIVE" : current.formattedDuration}\` - ${current.user}\n\`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\n`;
                description = description += q.slice(i0, i1)
                    .join("\n");

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(queue.songs.length/10)} | ${message.translate("music/queue:SONGS", {totalSongs: queue.songs.length})} | ${queue.formattedDuration}`)
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
                if (i1 > queue.songs.length + 10) {
                    return msg.delete();
                }
                if (!i0 || !i1) {
                    return msg.delete();
                }

                let description = `[${current.name}](${current.url}) - \`${current.duration == 0 ? "◉ LIVE" : current.formattedDuration}\` - ${current.user}\n\`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\n`;
                description = description += q.slice(i0, i1)
                    .join("\n");

                // Update the embed with new informations
                embed.setFooter(`${message.translate("common:PAGE")}: ${page}/${Math.ceil(queue.songs.length/10)} | ${message.translate("music/queue:SONGS", {totalSongs: queue.songs.length})} | ${queue.formattedDuration}`)
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

module.exports = Queue;
