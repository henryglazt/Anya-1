const Command = require("../../base/Command.js"),
	Discord = require("discord.js");

class Serverinfo extends Command {

	constructor (client) {
		super(client, {
			name: "serverinfo",
			dirname: __dirname,
			enabled: true,
			guildOnly: true,
			aliases: [ "si" ],
			memberPermissions: [],
			botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
			nsfw: false,
			ownerOnly: false
		});
	}

	async run (message, args, data) {
        
		let guild = message.guild;

		if(args[0]){
			let found = this.client.guilds.cache.get(args[0]);
			if(!found){
				found = this.client.guilds.cache.find((g) => g.name === args.join(" "));
				if(found){
					guild = found;
				}
			}
		}

		guild = await guild.fetch();

  const features = {"ANIMATED_ICON": "Animated Icon",
                    "BANNER": "Banner",
                    "COMMERCE": "Commerce",
                    "COMMUNITY": "Community",
                    "DISCOVERABLE": "Discoverable",
                    "FEATUREABLE": "Featureable",
                    "INVITE_SPLASH": "Invite Splash",
                    "NEWS": "News",
                    "PARTNERED": "Partnered",
                    "VANITY_URL": "Vanity URL",
                    "VERIFIED": "Verified",
                    "VIP_REGIONS": "Vip Regions",
                    "WELCOME_SCREEN_ENABLED": "Welcome Screen Enabled"
                   };
  
  const feature = guild.features;
  guild.members.fetch().then(fetchedMembers => {
    const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online').size;
    const totalIdle = fetchedMembers.filter(member => member.presence.status === 'idle').size;
    const totalDND = fetchedMembers.filter(member => member.presence.status === 'dnd').size;
    const totalOffline = fetchedMembers.filter(member => member.presence.status === 'offline').size;
  
  const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
    let count = 0;
  
    for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
    
    let banner = guild.bannerURL({ format: 'png', dynamic: true, size: 2048 });
    let mark = `🔗 [${guild.name} Banner]`;
    if (banner !== null) banner = `${mark}(${banner})`;
    
    let vanity = guild.vanityURLCode;
    let url = '🔗 https://discord.gg/';
    if (vanity !== null) vanity = `${url}${vanity}`;

    let partnered = {"true": "<:DiscordPartnerServer:744430120479096832> `YES`", "false": "<:notpartnered:744986300649832609> `NO`"};
    let emo = {"0": "100", "1": "200", "2": "300", "3": "400"};
    let verified = {"true": "<:DiscordVerified:744430089697099847> `YES`", "false": "<:notverified:744986334321705100> `NO`"};
    let verifLevels = {"NONE": "`NONE`", "LOW": "`LOW`", "MEDIUM": "`MEDIUM`", "HIGH": "`(╯°□°）╯︵  ┻━┻`", "VERY_HIGH": "`┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻`"};
    let region = {"brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };
    
		const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

		const embed = new Discord.MessageEmbed()
			.setAuthor("SERVER INFO", "https://tinyurl.com/y4xs3cje")
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addField("**❯ General:**", [
			`**● Name:** ${guild.name}`,
			`**● ID:** \`${guild.id}\``,
			`**● Owner:** ${guild.owner}`,
			`**● Region:** ${region[guild.region]}`,
			`**● Verification Level:** ${verifLevels[guild.verificationLevel]}`,
			`**● Explicit Content Filter:** \`${guild.explicitContentFilter}\``,
			`**● Boosters:** <a:Boost:774542922472488970> ${guild.premiumSubscriptionCount}`,
			`**● Tier:** ${this.client.customEmojis.boost[guild.premiumTier]} Level ${guild.premiumTier}`,
			`**● Banner:** ${banner ? banner : '`None`'}`,
			`**● Vanity URL:** ${vanity ? vanity : '`None`'}`,
			`**● Partnered | Verified:** ${partnered[guild.partnered]} | ${verified[guild.verified]}`,
			`**● Creation Date:** ${message.printDate(guild.createdAt)}`,
			`\u200b`
			])
    
			.addField("**❯ Statistics:**", [
			`**● Role Count:** ${roles.length}`,
			`**● Emoji Count:** ${guild.emojis.cache.size}`,
			`**● Regular Emoji Count:** ${guild.emojis.cache.filter(emoji => !emoji.animated).size}`,
			`**● Animated Emoji Count:** ${guild.emojis.cache.filter(emoji => emoji.animated).size}`,
			`**● Member Count:** ${guild.memberCount}`,
			`**● Humans:** ${guild.members.cache.filter(member => !member.user.bot).size}`,
			`**● Bots:** ${guild.members.cache.filter(member => member.user.bot).size}`,
			`**● Text Channels:** ${guild.channels.cache.filter(channel => channel.type === 'text').size}`,
			`**● Voice Channels:** ${guild.channels.cache.filter(channel => channel.type === 'voice').size}`,
			`**● Member in Voice Channels:** <a:giphy_3:744676992141623399> ${count}`,
			`**● Member Presences:**\n> <:online:741196747748933682> ${totalOnline}\n> <:idle:741197218861678644> ${totalIdle}\n> <:dnd:741196524238667846> ${totalDND}\n> <:offline:741197268123648020> ${totalOffline}`,
			`\u200b`
			])
    
			.addField("**❯ Features:**",[
			`\`${feature.length ? feature.map(ft => features[ft]).join(', ') : 'None'}\``,
			`\u200b`
			])

			.setColor(data.config.embed.color)
			.setFooter(data.config.embed.footer);

		message.channel.send(embed);
	})
	}
}

module.exports = Serverinfo;
