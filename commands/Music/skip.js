const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Skip extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["next", "s", "lanjut"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        const queue = this.client.distube.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.error("music/play:NO_VOICE_CHANNEL");
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            return message.error("music/play:MY_VOICE_CHANNEL");
        }
        if (!this.client.distube.isPlaying(message)) {
            return message.error("music/play:NOT_PLAYING");
        }
        if (!queue.songs[1]) {
            return message.error("music/skip:NO_NEXT_SONG");
        }
        const members = voice.members.filter((m) => !m.user.bot);
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/skip:DESCRIPTION"))
            .setThumbnail(queue.songs[0].thumbnail)
            .setFooter(data.config.embed.footer)
            .setColor(data.config.embed.color);
        const m = await message.channel.send(embed);
        if (members.size > 1) {
            m.react("⏭️");
            const mustVote = Math.floor(members.size / 2 + 1);
            embed.setDescription(message.translate("music/skip:VOTE_CONTENT", {
                songName: queue.songs[1].name,
                songURL: queue.songs[1].url,
                songDuration: queue.songs[1].duration == 0 ? "◉ LIVE" : queue.songs[1].formattedDuration,
                voteCount: 0,
                requiredCount: mustVote
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
                    this.client.distube.skip(message);
                    m.edit({
                        embed: {
                            color: data.config.embed.color,
                            footer: {
                                text: data.config.embed.footer
                            },
                            thumbnail: {
                                url: queue.songs[0].thumbnail
                            },
                            description: message.translate("music/skip:SUCCESS")
                        }
                    });
                    collector.stop(true);
                } else {
                    embed.setDescription(message.translate("music/skip:VOTE_CONTENT", {
                        songName: queue.songs[1].name,
                        songURL: queue.songs[1].url,
                        songDuration: queue.songs[1].duration == 0 ? "◉ LIVE" : queue.songs[1].formattedDuration,
                        voteCount: haveVoted,
                        requiredCount: mustVote
                    }));
                    m.edit(embed);
                }
            });
            collector.on("end", (collected) => {
                return m.reactions.removeAll();
            });
        } else {
            this.client.distube.skip(message);
            m.edit({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    thumbnail: {
                        url: queue.songs[0].thumbnail
                    },
                    description: message.translate("music/skip:SUCCESS")
                }
            });
        }
    }
}
module.exports = Skip;
