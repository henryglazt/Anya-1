const Command = require("../../base/Command.js"),
    Discord = require("discord.js"),
      API = require("../../helpers/utils.js");

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
          let play = message.client.manager.players.get(message.guild.id)

  const { channel } = message.member.voice;

  if(!channel) return message.reply("no channel");;
  if(!args.length) return message.reply("no args");

  if(!play) await message.client.commands.get("join").run(message, null, data);

  const player = message.client.manager.players.get(message.guild.id)

  if(!player.options.voiceChannel === channel.id) { return message.channel.send("...") }

  const search = args.join(' ');
  let res;

  try {
    res = await player.search(search, message.author);
    if (res.loadType === 'LOAD_FAILED') {
      if (!player.queue.current) player.destroy();
      throw new Error(res.exception.message);
    }
  } catch (err) {
    return message.reply(err.message);
  }

  switch (res.loadType) {
    case 'NO_MATCHES':
      if (!player.queue.current) player.destroy();
      return message.reply("result");
      case 'TRACK_LOADED':
      await player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.length) player.play();
      let embed = new Discord.MessageEmbed()
      embed.setTimestamp()
      embed.setDescription(`\`${res.tracks[0].title}\`\n${API.time2(res.tracks[0].duration)}`)
      embed.setFooter(res.tracks[0].requester.tag, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true })}`)
      return message.channel.send(embed)

    case 'PLAYLIST_LOADED':
      await player.queue.add(res.tracks);

      if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
      let embed2 = new Discord.MessageEmbed()
      embed2.setTimestamp()
      embed2.setDescription(`\`${res.playlist.name}\` \`${res.tracks.length}\` ${API.time2(res.playlist.duration)}`)
      return message.channel.send(embed2);

    case 'SEARCH_RESULT':
      let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|cancelar)$/i.test(m.content) || message.author.id && /^(\d+|cancel)$/i.test(m.content);
      if (res.tracks.length < max) max = res.tracks.length;

      const results = res.tracks
      .slice(0, max)
      .map((track, index) => `${++index} - \`${track.title}\``)
      .join('\n');

      let embed3 = new Discord.MessageEmbed()
      embed3.setTimestamp()
      embed3.addFields({ name: "Cancel", value: "Cancel" })
      embed3.setDescription(results)
      message.channel.send(embed3);

      try {
        collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
      } catch (e) {
        if (!player.queue.current) player.destroy();
        return message.reply("...");
      }

      const first = collected.first().content;

      if (first.toLowerCase() === 'cancelar' || first.toLowerCase() === 'cancel') {
        if (!player.queue.current) player.destroy();
        return message.channel.send("cancel");
      }

      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) return message.reply("max" + max + ')');

      const track = res.tracks[index];
      await player.queue.add(track);

      let embed4 = new Discord.MessageEmbed()
      embed4.setFooter(` ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true })}`)
      embed4.setDescription(`\`${track.title}\` \n ${API.time2(track.duration)}`)
      if(!player.playing && !player.paused && !player.queue.length) player.play();
      return message.channel.send(embed4);
  }
      
    }
}
module.exports = Play;
