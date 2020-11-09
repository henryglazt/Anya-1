const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Stop extends Command {
    constructor(client) {
        super(client, {
            name: "stop",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "dc", "leave", "disconnect" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

    const player = message.client.manager.players.get(message.guild.id);
    if(!player) return message.reply(idioma.stop.nada)

    const { channel } = message.member.voice

    if(!channel) return message.reply(idioma.stop.conectar);
    if (channel.id !== player.voiceChannel) return message.reply(idioma.stop.conectar2);

    player.destroy();
    return message.channel.send(idioma.stop.parou);


        /*const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const voice = message.member.voice.channel;
        if (!voice) {
            xembed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        const player = message.client.manager.players.get(message.guild.id);
        if (!player) {
            xembed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(xembed);
        }
        if (voice.id !== player.voiceChannel) {
            xembed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        player.destroy();
        xembed.setDescription(message.translate("music/stop:LEAVE"));
        return message.channel.send(xembed);*/

        /*const members = voice.members.filter((m) => !m.user.bot);
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.translate("music/stop:DESCRIPTION"))
            .setFooter(data.config.embed.footer)
            .setColor(data.config.embed.color);
        const m = await message.channel.send(embed);
        if (members.size > 1) {
            m.react("⏹️");
            const mustVote = Math.floor(members.size / 2 + 1);
            embed.setDescription(message.translate("music/stop:VOTE_CONTENT", {
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
                    this.client.distube.stop(message);
                    message.channel.send({
                        embed: {
                            color: data.config.embed.color,
                            footer: {
                                text: data.config.embed.footer
                            },
                            description: message.translate("music/stop:SUCCESS")
                        }
                    });
                    collector.stop(true);
                } else {
                    embed.setDescription(message.translate("music/stop:VOTE_CONTENT", {
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
            this.client.distube.stop(message);
            m.edit({
                embed: {
                    color: data.config.embed.color,
                    footer: {
                        text: data.config.embed.footer
                    },
                    description: message.translate("music/stop:SUCCESS")
                }
            });
        }*/


    }
}
module.exports = Stop;
