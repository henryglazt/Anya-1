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
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== channel.id) {
            embed.setDescription(message.translate("music/play:MY_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!channel) {
            embed.setDescription(message.translate("music/play:NO_VOICE_CHANNEL"));
            return message.channel.send(embed);
        }
        if (!channel.joinable) {
            embed.setDescription(message.translate("music/play:VOICE_CHANNEL_CONNECT"));
            return message.channel.send(embed);
        }
        const search = args.join(" ");
        if (!search) {
            embed.setDescription(message.translate("music/play:MISSING_SONG_NAME"));
            return message.channel.send(embed);
        }

    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true
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
    } catch (err) {
      return message.reply(`There was an error while searching: ${err.message}`);
    }

    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy();
        return message.reply('No results were found.');
      case 'TRACK_LOADED':
        await player.queue.add(res.tracks[0]);

        if (!player.playing && !player.paused && !player.queue.length) player.play();
        return message.channel.send(`**Enqueuing** \`${res.tracks[0].title}\`.`);
      case 'PLAYLIST_LOADED':
        await player.queue.add(res.tracks);

        if (!player.playing && !player.paused && player.queue.size === res.tracks.length) player.play();
        return message.reply(`**Enqueuing playlist**: \n **${res.playlist.name}** : **${res.tracks.length} tracks**`);
      case 'SEARCH_RESULT':
        let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;

        const results = res.tracks
            .slice(0, max)
            .map((track, index) => `${++index} - \`${track.title}\``)
            .join('\n');
            
        const resultss = new Discord.MessageEmbed()
            .setDescription(results)
            .setColor(data.config.embed.color)

        message.channel.send(resultss);
        message.channel.send("You have 30 senconds to select.")

        try {
          collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.reply("You didn't provide a selection.");
        }

        const first = collected.first().content;

        if (first.toLowerCase() === 'end') {
          if (!player.queue.current) player.destroy();
          return message.channel.send('Cancelled selection.');
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);

        const track = res.tracks[index];
        await player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.length) player.play();
        return message.channel.send(`**Enqueuing:** \`${track.title}\`.`);
    }
      
    }
}
module.exports = Play;
