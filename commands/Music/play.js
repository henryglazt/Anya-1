const Command = require("../../base/Command.js"),
    Discord = require("discord.js");
class Play extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "p" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {
        const embed = new Discord.MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
        const { channel } = message.member.voice;
        if (!channel) {
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        const perms = channel.permissionsFor(this.client.user);
        if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
            embed.setDescription(message.translate("music/play:VOICE_CHANNEL_CONNECT"));
            return message.channel.send(embed);
        }
        const search = args.join(" ");
        if (!search) {
            embed.setDescription(message.translate("music/play:MISSING_SONG_NAME"));
            return message.channel.send(embed);
        }
      
        const player = this.client.manager.players.get(message.guild.id)

  if(!player) {
    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    player.connect();
  }

  let res;

  try {
    res = await player.search(search, message.author);
    if (res.loadType === 'LOAD_FAILED') {
      if (!player.queue.current) player.destroy();
      throw new Error(res.exception.message);
    }
  } catch (e) {
    return message.reply("Something went wrong..." + e.message);
  }

  switch (res.loadType) {
    case 'NO_MATCHES':
      if (!player.queue.current) player.destroy();
      return message.reply("No matches found");
      case 'TRACK_LOADED':
      await player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.length) player.play();
      let embed = new Discord.MessageEmbed()
      embed.setTimestamp()
      embed.setColor(this.config.embed.color)
      embed.setDescription(`**Added to the queue** \`${res.tracks[0].title}\`\n**Duration:**`)
      embed.setFooter("Requested by" + res.tracks[0].requester.tag, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
      return message.channel.send(embed)

    case 'PLAYLIST_LOADED':
      await player.queue.add(res.tracks);

      if (!player.playing && !player.paused && player.queue.size === res.tracks.length) player.play();
      let embed2 = new Discord.MessageEmbed()
      embed2.setTimestamp()
      embed2.setColor(this.config.embed.color)
      embed2.setDescription(`**Added the playlist** \`${res.playlist.name}\` **with** \`${res.tracks.length}\``)
      return message.channel.send(embed2);

    case 'SEARCH_RESULT':
      let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|cancelar)$/i.test(m.content) || message.author.id && /^(\d+|cancel)$/i.test(m.content);
      if (res.tracks.length < max) max = res.tracks.length;

      const results = res.tracks
      .slice(0, max)
      .map((track, index) => `${++index} - \`${track.title}\``)
      .join('\n');

      let embed3 = new Discord.MessageEmbed()
      embed3.setColor(this.config.embed.color)
      embed3.setTimestamp()
      embed3.addFields({ name: "Cancel", value: "Type `cancel` to cancel" })
      embed3.setDescription(results)
      message.channel.send(embed3);

      try {
        collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
      } catch (e) {
        if (!player.queue.current) player.destroy();
        return message.reply("Selection Timed out");
      }

      const first = collected.first().content;

      if (first.toLowerCase() === 'cancelar' || first.toLowerCase() === 'cancel') {
        if (!player.queue.current) player.destroy();
        return message.channel.send("Cancelled the selection");
      }

      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) return message.reply("The provived number is either too small or too big (1-" + max + ')');

      const track = res.tracks[index];
      await player.queue.add(track);

      let embed4 = new Discord.MessageEmbed()
      embed4.setColor(this.config.embed.color)
      embed4.setFooter(`**Requested by** ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
      embed4.setDescription(`**Added to the queue** \`${track.title}\``)
      if(!player.playing && !player.paused && !player.queue.length) player.play();
      return message.channel.send(embed4);
    }
      
    }
}
module.exports = Play;
