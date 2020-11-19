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
        if (!player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:NO_NEXT_SONG"));
            return message.channel.send(embed);
        }
        if (player.queue.size === 1) {
            embed.setDescription(musji.info + " " + message.translate("music/skip:SKIP"));
            return message.channel.send(embed);
        }

        let song = message.translate("music/skipto:SONG");
        let songs = message.translate("music/skipto:SONGS");
        let track = Number(args[0]);
        if (!track || isNaN(track) || track < 1 || track > player.queue.size) {
            embed.setDescription(musji.info + " " + message.translate("music/skipto:VALUE", {
               max: player.queue.totalSize
            }));
            return message.channel.send(embed);
        }
        if (track > 1 && player.queue.size !== track) {
            player.queue.splice(0, track - 1);
            player.stop();
            embed.addField(musji.next + " " + message.translate("music/skip:SUCCESS"), `\`${track - 1 === 1 ? "1 " + `${song}` : `${track - 1} songs`}\``);
            return message.channel.send(embed);
        } else if (track > 1 && player.queue.size === track) {
            player.queue.splice(0, player.queue.length - 1);
            player.stop();
            embed.addField(musji.next + " " + message.translate("music/skip:SUCCESS"), `\`${track - 1}\`` + " " + `\`${songs}\``);
            return message.channel.send(embed);
        };
        /*const members = voice.members.filter((m) => !m.user.bot);
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
        }*/
    }
}
module.exports = Skipto;
