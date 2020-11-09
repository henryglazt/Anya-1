const Command = require("../../base/Command.js"),
    Discord = require("discord.js");

class Queue extends Command {

    constructor(client) {
        super(client, {
            name: "queue",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "q" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }

    async run(message, args, data) {

        const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)

        /*const queue = this.client.distube.getQueue(message.guild.id);

        if (!queue) {
            xembed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(xembed);
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

        });*/

   /* const player = message.client.manager.players.get(message.guild.id);
    if (!player) return message.reply("I have not joined a channel because I have nothing to play. Use the play command to play the song.");

    const queue = player.queue;
    const embed = new Discord.MessageEmbed().setAuthor(`Queue for ${message.guild.name}`);

    const multiple = 10;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current) embed.addField("Current", `[${queue.current.title}](${queue.current.uri})`);

    if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
    else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

    return message.reply(embed);*/

        try {
            const { channel } = message.member.voice;
            if (!channel) return message.channel.send('**You Have To Be Connected To A Voice Channel!**');

            const player = message.client.manager.players.get(message.guild.id);
            if (!player || player.queue.size === 0 || (player.position === 0 && !player.playing)) return message.channel.send('**Nothing Playing In This Server!**');
            if (channel.id !== player.voiceChannel) return message.channel.send('**You Have To Be In The Same Voice Channel With The Bot!**');

            let currentPage = 0;
            const embeds = this.generateQueueEmbed(message, player.queue);
            const queueEmbed = await message.channel.send(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
            await queueEmbed.react('⬅️');
            await queueEmbed.react('⏹')
            await queueEmbed.react('➡️');

            const filter = (reaction, user) => ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = queueEmbed.createReactionCollector(filter)

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '➡️') {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else if (reaction.emoji.name === '⬅️') {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                    }
                } else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(message.author.id)
            });
        } catch (error) {
            console.error(error);
            return message.channel.send(`An Error Occurred: \`${error.message}\`!`);
        };
    };

    generateQueueEmbed(message, queue) {
        const embeds = [];
        let size = queue.size === 0 && queue.current !== null ? 1 : queue.size;
        let k = 10;
        for (let i = 0; i < size; i += 10) {
            const current = queue.slice(embeds.length === 0 ? i : i - 1, embeds.length === 0 ? k - 1: k - 1);
            let j;
            embeds.length === 0 ? j = i : j = i - 1;
            k += 10;
            const info = current.map(track => `${++j + 1} - [${track.title}](${track.uri})`).join('\n');
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${this.client.user.username} Queue`, this.client.user.displayAvatarURL())
                .setTitle('Song Queue\n')
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setColor('GREEN')
                .setDescription(`\n**Current Song** - [${queue.current.title}](${queue.current.uri})\n\n${info}`)
                .setFooter(`Requested By - ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            embeds.push(embed);
        };
        return embeds;

    }

}
module.exports = Queue;
