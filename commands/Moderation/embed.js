const Command = require("../../base/Command.js"),
    Discord = require("discord.js");

class Embed extends Command {

    constructor(client) {
        super(client, {
            name: "embed",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: ["MANAGE_MESSAGES"],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });
    }

    async run(msg, args, data) {

        let imgurl;
        args = args.join(" ");
        // URL checker
        const urlcheck = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.exec(args);
        if (urlcheck) args = args.slice(0, urlcheck.index) + args.slice(urlcheck.index + urlcheck[0].length, args.length);
        if (urlcheck) imgurl = urlcheck[0];
        if (!imgurl && msg.attachments && msg.attachments[0]) imgurl = msg.attachments[0].proxy_url;
        if (!imgurl) imgurl;

        const embed = new Discord.MessageEmbed()
            .setDescription(args)
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
            .setThumbnail(imgurl ? imgurl : null);
        msg.channel.send(embed);
    }
}

module.exports = Embed;
