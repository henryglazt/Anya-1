const Command = require("../../base/Command.js"),
      { MessageEmbed } = require("discord.js"),
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
        
        let embed = new MessageEmbed()
        .setColor(data.config.embed.color)
        .setFooter(data.config.embed.footer)
        .setTimestamp()
        
  let play = message.client.manager.players.get(message.guild.id)

  const { channel } = message.member.voice;

  if(!channel) return message.reply("no channel");
  if(!args.length) return message.reply("no args");

  if(!play) await message.client.commands.get("join").run(message, null, data);

  const player = message.client.manager.players.get(message.guild.id)

  if(channel.id !== player.voiceChannel) { return message.channel.send("...") }

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
      embed.setDescription(`\`${res.tracks[0].title}\`\n${API.time2(res.tracks[0].duration)}`)
      embed.setFooter(res.tracks[0].requester.tag, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true })}`)
      return message.channel.send(embed)

    case 'PLAYLIST_LOADED':
      await player.queue.add(res.tracks);

      if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
      embed.setDescription(`\`${res.playlist.name}\` \`${res.tracks.length}\` ${API.time2(res.playlist.duration)}`)
      return message.channel.send(embed);

    case 'SEARCH_RESULT':
      let resembed = new MessageEmbed()
      let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|cancelar)$/i.test(m.content) || message.author.id && /^(\d+|cancel)$/i.test(m.content);
      if (res.tracks.length < max) max = res.tracks.length;

      const results = res.tracks
      .slice(0, max)
      .map((track, index) => `${++index} - \`${track.title}\``)
      .join('\n');

      resembed.addFields({ name: "Cancel", value: "Cancel" })
      resembed.setDescription(results)
      message.channel.send(resembed);

      try {
        collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
      } catch (e) {
        if (!player.queue.current) player.destroy();
        return message.reply("...");
      }

      const first = collected.first().content;

      if (first.toLowerCase() === 'cancel' || first.toLowerCase() === 'batal') {
        if (!player.queue.current) player.destroy();
        return message.channel.send("cancel");
      }

      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) return message.reply("max" + max + ')');

      const track = res.tracks[index];
      await player.queue.add(track);

      embed.setFooter(` ${track.requester.tag}`, `${track.requester.displayAvatarURL({ dynamic: true })}`)
      embed.setDescription(`\`${track.title}\` \n ${API.time2(track.duration)}`)
      if(!player.playing && !player.paused && !player.queue.length) player.play();
      return message.channel.send(embed);
      }
      
    }
}
module.exports = Play;
