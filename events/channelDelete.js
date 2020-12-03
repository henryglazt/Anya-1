const { MessageEmbed } = require("discord.js");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(channel) {

        const client = this.client;
        const musji = client.customEmojis.music;

        const player = client.manager.players.get(channel.guild.id);
        if (!player) return;

        let embed = new MessageEmbed()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png")
            .setTitle(musji.leave + " " + channel.guild.translate("music/stop:LEAVE"))
            .setDescription(channel.guild.translate("music/stop:THANK", {
              anya: client.user.username
            }));

        if (channel.type === voice && channel.id === player.voiceChannel) {
            channel.send(embed);
            return player.destroy()
        }
    }
};
