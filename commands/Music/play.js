const Command = require("../../base/Command.js"),
  { MessageEmbed } = require("discord.js"),
  { formatTime } = require("../../helpers/functions.js");

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
    
    const musji = this.client.customEmojis.music;
    const embed = new MessageEmbed()
      .setColor(data.config.embed.color)
      .setFooter(data.config.embed.footer);

    const play = message.client.manager.players.get(message.guild.id);
    const { channel } = message.member.voice;
    if (!channel) {
      embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
      return message.channel.send(embed);
    }
    if (!args.length) {
      embed.setDescription([
        message.translate("music/play:NO_ARGS"),
        musji.youtube + " Youtube",
        musji.soundcloud + " Soundcloud",
        musji.spotify + " Spotify",
        musji.bandcamp + " Bandcamp",
        musji.twitch + " Twitch",
        musji.mixer + " Mixer",
        musji.vimeo + " Vimeo"
        ]);
      return message.channel.send(embed);
    }
    if (!play) {
      await message.client.commands.get("join").run(message, null, data);
    }
    const player = message.client.manager.players.get(message.guild.id);
    if (channel.id !== player.voiceChannel) {
      embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
      return message.channel.send(embed);
    }

    const search = args.join(" ");
    let res;

    try {
      res = await player.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy();
        throw new Error(res.exception.message);
      }
    } catch (err) {
      return message.error(message.translate("music/play:ERROR", {
        error: err
      }));
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        embed.setDescription(this.client.customEmojis.error + " " + message.translate("music/play:NO_RESULT"));
        return message.channel.send(embed);
      
      case "TRACK_LOADED":
        await player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length) {
          player.play();
          embed.setThumbnail(`https://i.ytimg.com/vi/${res.tracks[0].identifier}/hqdefault.jpg`);
          embed.addField(musji.add + " " + message.translate("music/play:ADDED"), message.translate("music/play:SONG", {
            songName: res.tracks[0].title,
            songURL: res.tracks[0].uri,
            songDuration: formatTime(res.tracks[0].duration)
          }));
          return message.channel.send(embed);
        }

      case "PLAYLIST_LOADED":
        await player.queue.add(res.tracks);
        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) {
          player.play();
          embed.setThumbnail(`https://i.ytimg.com/vi/${res.tracks[0].identifier}/hqdefault.jpg`);
          embed.addField(musji.add + " " + message.translate("music/play:ADDED"), message.translate("music/play:ADDED_PL", {
            items: res.tracks.length,
            plName: res.playlist.name,
            plURL: search,
            plDuration: fomatTime(res.playlist.duration)
          }));
          return message.channel.send(embed);
        }
        
      case "SEARCH_RESULT":
        let resembed = new MessageEmbed();
        let max = 5,
          collected,
          filter = m => (m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content)) || (message.author.id && /^(\d+|batal)$/i.test(m.content));
        if (res.tracks.length < max) max = res.tracks.length;

        const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index} - [${track.title}](${track.uri}) - \`${formatTime(track.duration)}\``)
          .join("\n");

        resembed.addField(musji.musicfolder + " " + message.translate("music/play:HEADER"), results + "\n\n" + message.translate("music/play:FOOTER"));
        resembed.setColor(data.config.embed.color);
        resembed.setFooter(data.config.embed.footer);
        message.channel.send(resembed);

        try {
          collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30e3,
            errors: ["time"]
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.error(message.translate("music/play:ERROR", {
            error: e
          }));
        }

        const first = collected.first().content;
        if (first.toLowerCase() === "cancel" || first.toLowerCase() === "batal") {
          if (!player.queue.current) player.destroy();
          return message.channel.send(message.translate("music/play:CANCELED"));
        }
        const index = Number(first) - 1;
        if (index < 0 || index > max - 1) {
          return message.reply("max" + max + ")");
        }
        
        const track = res.tracks[index];
        await player.queue.add(track);

        embed.setThumbnail(`https://i.ytimg.com/vi/${track.identifier}/hqdefault.jpg`);
        embed.addField(musji.add + " " + message.translate("music/play:ADDED"), message.translate("music/play:SONG", {
          songName: track.title,
          songURL: track.uri,
          songDuration: formatTime(track.duration)
        }));
        if (!player.playing && !player.paused && !player.queue.length)
          player.play();
        return message.channel.send(embed);
    }
  }
}
module.exports = Play;
