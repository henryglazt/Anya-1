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
            .setTitle(musji.leave + " " + newState.guild.translate("music/stop:LEAVE"))
            .setDescription(newState.guild.translate("music/stop:ALONE") + "\n" + newState.guild.translate("music/stop:THANK", {
                  anya: client.user.username
            }));

        if (!chnl) {
            channel.send(embed);
            return player.destroy();
        }
        const member = client.guilds.cache.get(guild).channels.cache.get(chnl);
        const exist = member.members.get(v.id);
        if (exist) {
            clearTimeout(v.timeout2);
        }
        if (exist && exist.voice.sessionID !== v.session) {
            v.session = exist.voice.sessionID;
        }
        if (!exist && member.members.filter(m => !m.user.bot).size > 0) {
            v.timeout2 = setTimeout(() => {
                let arr = [];
                member.members.filter(m => !m.user.bot).forEach(m => arr.push({
                    name: m.user.username,
                    id: m.id,
                    sid: m.voice.sessionID
                }));
                arr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                v.id = arr[0].id;
                v.session = arr[0].sid;
            }, 60000);
        }
        if (!exist && member.members.filter(m => !m.user.bot).size < 1 || member.members.filter(m => !m.user.bot).size < 1) {
            channel.send(embed);
            return player.destroy();
        }
    }
};
