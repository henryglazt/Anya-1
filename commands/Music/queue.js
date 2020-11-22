const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");
class Queue extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "q" ],
            memberPermissions: [],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 5000
        });
    }
    async run(message, args, data) {

    const xembed = new MessageEmbed()
        .setColor(data.config.embed.color)
        .setFooter(data.config.embed.footer)

    const player = message.client.manager.players.get(message.guild.id);
    if (!player) return message.reply("No queue");

    const queue = player.queue;
    const embed = new MessageEmbed().setAuthor(`Queue for ${message.guild.name}`);

    const multiple = 5;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if(queue.current) embed.addField("Now Playing", `[${queue.current.title}](${queue.current.uri}) | \`${player.queue.current.requester.tag}\``);

    if(!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `Page ${page}` : "the queue"}.`);
    else embed.setDescription(tracks.map((track, i) => `**${start + (++i)} -** [${track.title}](${track.uri})`).join("\n"));

    const maxPages = Math.ceil(queue.length / multiple);
    embed.setColor(data.config.embed.color)
   // embed.setFooter(`${idioma.queue.arg1.replace(/^./, idioma.queue.arg1[0].toUpperCase())} ${page > maxPages ? maxPages : page} ${idioma.queue.arg3} ${maxPages}`);
    return message.channel.send(embed);
    }
}
module.exports = Queue;
