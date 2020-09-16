const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Filter extends Command {
    constructor(client) {
        super(client, {
            name: "filter",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        const xembed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const voice = message.member.voice.channel;
        if (!voice) {
            xembed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            xembed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(xembed);
        }
        if (!this.client.distube.isPlaying(message)) {
            xembed.setDescription(message.translate("music/play:NOT_PLAYING"));
            return message.channel.send(xembed);
        }
        const filters = [`3d`, `bassboost`, `echo`, `flanger`, `gate`, `haas`, `karaoke`, `nightcore`, `reverse`, `vaporwave`]
        if (!args[0]) {
            xembed.setDescription(message.translate("music/filter:NO_ARGS") + "\n\n**" + filters.join("\n") + "**");
            return message.channel.send(xembed);
        }
        if (filters.includes(args[0])) {
            let filter = this.client.distube.setFilter(message, args[0]);
            xembed.setDescription(filter ? message.translate("music/filter:MODE", {
                filter: filter
            }) : message.translate("music/filter:OFF"));
            return message.channel.send(xembed);
        } else {
            xembed.setDescription(message.translate("music/filter:NO_FILTER", {
                named: args[0]
            }));
            return message.channel.send(xembed);
        }
    }
}
module.exports = Filter;
