const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Join extends Command {
    constructor(client) {
        super(client, {
            name: "join",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: ["summon", "masuk"],
            memberPermissions: [],
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

    const player = message.client.manager.players.get(message.guild.id);

    const { channel } = message.member.voice;

    if (!channel) return message.reply("no channel");

  if(!player) {
    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    if(!channel.joinable) { return message.channel.send("perms") }
    player.connect();
    player.set("member", message.member);
  } else {
return message.channel.send("already being used");
}
       /* const xembed = new Discord.MessageEmbed()
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
        if (message.guild.me.voice.channel && message.member.voice.channel.id === message.guild.me.voice.channel.id) {
            xembed.setDescription(message.translate("music/play:JOINED"));
            return message.channel.send(xembed);
        }
        const perms = voice.permissionsFor(this.client.user);
        if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
            xembed.setDescription(message.translate("music/play:VOICE_CHANNEL_CONNECT"));
            return message.channel.send(xembed);
        }
        voice.join()
            .then(connection => {
                connection.voice.setSelfDeaf(true)
                xembed.setDescription(message.translate("music/play:JOIN"));*/
    }
}
module.exports = Join;
