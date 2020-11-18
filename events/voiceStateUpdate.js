const { MessageEmbed } = require("discord.js");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldState, newState) {

        const client = this.client;
        const musji = client.customEmojis.music;

        const player = client.manager.players.get(newState.guild.id);
        if (!player) return;

        const channel = client.channels.cache.get(player.textChannel);

        let chnl = player.voiceChannel;
        let guild = player.guild;

        let embed = new MessageEmbed()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setImage("https://cdn.discordapp.com/attachments/544570919553859597/777604827752169472/1543963619588.jpg")
            .addField(musji.leave + " " + newState.guild.translate("music/stop:LEAVE"), newState.guild.translate("music/stop:THANK", {
              anya: client.user.username
            }));

        if (!chnl) {
            channel.send(embed);
            return player.destroy()
        }
        if (client.guilds.cache.get(guild).channels.cache.get(chnl).members.filter(m => !m.user.bot).size < 1) {
            channel.send(embed);
            return player.destroy()
        }
    }
};
