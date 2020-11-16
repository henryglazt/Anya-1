const { MessageEmbed } = require("discord.js");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(oldState, newState) {

        const client = this.client;

        const player = client.manager.players.get(newState.guild.id);
        if (!player) return;

        const channel = client.channels.cache.get(player.textChannel);

        let chnl = player.voiceChannel;
        let guild = player.guild;

        let embed = new MessagEmbed()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setImage("https://cdn.discordapp.com/emojis/754574913209368687.gif")
            .setAuthor(newState.guild.translate("music/stop:LEAVE"), https://cdn.discordapp.com/emojis/754574913209368687.gif);

        if (client.guilds.cache.get(guild).channels.cache.get(chnl).members.filter(m => !m.user.bot).size < 1) {
            channel.send(embed);
            return player.destroy()
        }
    }
};
