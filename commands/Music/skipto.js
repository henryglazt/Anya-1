const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Skipto extends Command {
    constructor(client) {
        super(client, {
            name: "skipto",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "jump" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

        const musji = this.client.customEmojis.music;
        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)

        const player = message.client.manager.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (!channel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!player) {
            embed.setDescription(musji.info + " " + message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(embed);
        }
        if (channel.id !== player.voiceChannel) {
            embed.setDescription(musji.info + " " + message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (player.queue.totalSize <= 1) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }

        let songs = parseInt(args[0])

        if (!args[0] || isNaN(songs) || args[0] < 1) {
            embed.setDescription(musji.info + " " + essage.translate("music/skipto:VALUE"));
            return message.channel.send(xembed);
        }
        if (args[0] > player.queue.size || !player.queue[player.queue.size > 1 ? args[0] - 2 : args[0] - 1]) return message.channel.send('**Song Not Found!**');

        if (args[0] > 1 && player.queue.size != args[0]) {
            player.queue.splice(0, args[0] - 2);
            player.stop();
            return message.channel.send(`**Skipped \`${args[0] - 1 === 1 ? '1 Song' : `${args[0] - 1} Songs`}\`**`);
        } else if (args[0] > 1 && player.queue.size == args[0]) {
            player.queue.splice(0, player.queue.length - 1);
            player.stop();
            return message.channel.send(`**Skipped \`${args[0] - 1} Songs\`**`);
        };
        const members = voice.members.filter((m) => !m.user.bot);
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/skipto:DESCRIPTION"))
            .setThumbnail(queue.songs[songs - 1].thumbnail)
            .setFooter(data.config.embed.footer)
            .setColor(data.config.embed.color);

        const m = await message.channel.send(embed);
        if (members.size > 1) {
            m.react("⏭️");
            const mustVote = Math.floor(members.size / 2 + 1);
            embed.setDescription(message.translate("music/skipto:VOTE_CONTENT", {
                songName: queue.songs[songs].name,
                songURL: queue.songs[songs].url,
                songDuration: queue.songs[songs].duration == 0 ? "◉ LIVE" : queue.songs[songs].formattedDuration,
                voteCount: 0,
                requiredCount: mustVote,
                totalSongs: songs
            }));
            m.edit(embed);
            const filter = (reaction, user) => {
                const member = message.guild.members.cache.get(user.id);
                const voiceChannel = member.voice.channel;
                if (voiceChannel) {
                    return voiceChannel.id === voice.id;
                }
            };
            const collector = await m.createReactionCollector(filter, {
                time: 25000
            });
            collector.on("collect", (reaction) => {
                const haveVoted = reaction.count - 1;
                if (haveVoted >= mustVote) {
                    this.client.distube.jump(message, songs);
                    m.edit({
                        embed: {
                            color: data.config.embed.color,
                            footer: {
                                text: data.config.embed.footer
                            },
                            thumbnail: {
                                url: queue.songs[0].thumbnail
                            },
                            description: message.translate("music/skipto:SUCCESS", {
                                totalSongs: songs
                            })
                        }
                    });
                    collector.stop(true);
                } else {
                    embed.setDescription(message.translate("music/skipto:VOTE_CONTENT", {
                        songName: queue.songs[songs].name,
                        songURL: queue.songs[songs].url,
                        songDuration: queue.songs[songs].duration == 0 ? "◉ LIVE" : queue.songs[songs].formattedDuration,
                        voteCount: haveVoted,
                        requiredCount: mustVote,
                        totalSongs: songs
                    }));
                    m.edit(embed);
                }
            });
            collector.on("end", (collected) => {
                return m.reactions.removeAll()
            });
        } else {
            this.client.distube.jump(message, songs);
            m.edit({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    thumbnail: {
                        url: queue.songs[0].thumbnail
                    },
                    description: message.translate("music/skipto:SUCCESS", {
                        totalSongs: songs
                    })
                }
            });
        }
    }
}
module.exports = Skipto;
