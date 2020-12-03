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

        let v = player.get("voiceData");
        const channel = client.channels.cache.get(player.textChannel);

        let chnl = player.voiceChannel;
        let guild = player.guild;

        let embed = new MessageEmbed()
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)
            .setImage("https://cdn.discordapp.com/attachments/773766203914321980/773785370503806976/banner_serverr_10.png")
            .addField(musji.leave + " " + newState.guild.translate("music/stop:LEAVE"), newState.guild.translate("music/stop:THANK", {
              anya: client.user.username
            }));

        if (!chnl) {
            channel.send(embed);
            return player.destroy()
        }
        const member = client.guilds.cache.get(guild).channels.cache.get(chnl);
        if (member.members.filter(m => !m.user.bot).size < 1) {
            channel.send(embed);
            return player.destroy()
        }
        if (member.members.filter(m => m.id === v.id && m.voice.sessionID !== v.session)) {
            v.session = newState.guild.members.cache.get(v.id).voice.sessionID;
        }
        if (member.members.filter(m => m.id !== v.id)) {
            setTimeout
        }
    }
};
