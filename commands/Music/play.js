const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Play extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["p"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        const embed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const voice = message.member.voice.channel;
        if (!voice) {
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        const perms = voice.permissionsFor(this.client.user);
        if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
            embed.setDescription(message.translate("music/play:VOICE_CHANNEL_CONNECT"));
            return message.channel.send(embed);
        }
        const string = args.join(" ");
        if (!string) {
            embed.setDescription(message.translate("music/play:MISSING_SONG_NAME"));
            return message.channel.send(embed);
        }
        try {
            voice.join()
                .then(connection => {
                    connection.voice.setSelfDeaf(true)
                });
            this.client.distube.play(message, string);
        } catch (e) {
            message.error(`Error: \`${e}\``)
        }
    }
}
module.exports = Play;
