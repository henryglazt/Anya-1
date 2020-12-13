const Command = require("../../base/Command.js"),
    { MessageEmbed } = require("discord.js");

class Serverinfo extends Command {
    constructor(client) {
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

    async run(message, args, data) {

    let guild = message.guild;

    if (args[0]) {
        let found = this.client.guilds.cache.get(args[0]);
        if (!found) {
            found = this.client.guilds.cache.find(g => g.name === args.join(" "));
        } else {
            guild = found;
        }
    }

    guild = await guild.fetch();

    const features = {
        ANIMATED_ICON: "Animated Icon",
        BANNER: "Banner",
        COMMERCE: "Commerce",
        COMMUNITY: "Community",
        DISCOVERABLE: "Discoverable",
        FEATUREABLE: "Featureable",
        INVITE_SPLASH: "Invite Splash",
        NEWS: "News",
        PARTNERED: "Partnered",
        VANITY_URL: "Vanity URL",
        VERIFIED: "Verified",
        VIP_REGIONS: "Vip Regions",
        WELCOME_SCREEN_ENABLED: "Welcome Screen Enabled"
    };

    const feature = guild.features;

    guild.members.fetch().then(fetchedMembers => {

        const totalOnline = fetchedMembers.filter(m => m.presence.status === "online").size;
        const totalIdle = fetchedMembers.filter(m => m.presence.status === "idle").size;
        const totalDND = fetchedMembers.filter(m => m.presence.status === "dnd").size;
        const totalOffline = fetchedMembers.filter(m => m.presence.status === "offline").size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === "voice");

        let count = 0;
        for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

        let mark = `🔗 [${guild.name}\`s ${message.translate("common:BANNER")}]`;
        let vanity = guild.vanityURLCode;
        let url = "🔗 https://discord.gg/";
        let banner = guild.bannerURL({ format: "png", dynamic: true, size: 2048 });
        if (vanity !== null) vanity = `${url}${vanity}`;
        if (banner !== null) banner = `${mark}(${banner})`;

        let partnered = {
            true: `<:DiscordPartnerServer:744430120479096832> \`${message.translate("common:YES")}\``,
            false: `<:notpartnered:744986300649832609> \`${message.translate("common:NO")}\``
        };

        let emo = {
            "0": "100",
            "1": "200",
            "2": "300",
            "3": "400"
        };

        let verified = {
            true: `<:DiscordVerified:744430089697099847> \`${message.translate("common:YES")}\``,
            false: `<:notverified:744986334321705100> \`${message.translate("common:NO")}\``
        };

        let verifLevels = {
            NONE: `\`${message.translate("common:NONE")}\``,
            LOW: `\`${message.translate("common:LOW")}\``,
            MEDIUM: `\`${message.translate("common:MEDIUM")}\``,
            HIGH: "`(╯°□°）╯︵  ┻━┻`",
            VERY_HIGH: "`┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻`"
        };

        let region = {
            "brazil": ":flag_br: Brazil",
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

        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString());

        const embed = new MessageEmbed()
            .setColor(data.config.embed.color)
            .setFooter(data.config.embed.footer)
            .setAuthor(`${message.translate("common:SERVER")} ${message.translate("common:INFO")}`, "https://tinyurl.com/y4xs3cje")
            .setThumbnail(guild.iconURL({dynamic: true}))
            .addField(`**❯ ${message.translate("common:GENERAL")}:**`, [
                `**● ${message.translate("common:NAME")}:** ${guild.name}`,
                `**● ${message.translate("common:ID")}:** \`${guild.id}\``,
                `**● ${message.translate("common:OWNER")}:** ${guild.owner}`,
                `**● ${message.translate("common:REGION")}:** ${region[guild.region]}`,
                `**● ${message.translate("common:VER_LVL")}:** ${verifLevels[guild.verificationLevel]}`,
                `**● ${message.translate("common:ECF")}:** \`${guild.explicitContentFilter}\``,
                `**● ${message.translate("common:BOOSTERS")}:** ${this.client.customEmojis.boost.boost} ${guild.premiumSubscriptionCount}`,
                `**● ${message.translate("common:TIER")}:** ${this.client.customEmojis.boost[guild.premiumTier]} Tier ${guild.premiumTier}`,
                `**● ${message.translate("common:BANNER")}:** ${banner ? banner : "`None `"}`,
                `**● ${message.translate("common:VAN_URL")}:** ${vanity ? vanity : "`None `"}`,
                `**● ${message.translate("common:PARTNERED")} | ${message.translate("common:VERIFIED")}:** ${partnered[guild.partnered]} | ${verified[guild.verified]}`,
                `**● ${message.translate("common:CREATION")} ${message.translate("common:DATE")}:** ${message.printDate(guild.createdAt)}`,
                `\u200b`
            ])
            .addField(`**❯ ${message.translate("common:STATISTICS")}:**`, [
                `**● ${message.translate("common:ROLE")} ${message.translate("common:COUNT")}:** ${roles.length}`,
                `**● ${message.translate("common:EMOJI")} ${message.translate("common:COUNT")}:** ${guild.emojis.cache.size}`,
                `**● ${message.translate("common:REGULAR")} ${message.translate("common:EMOJI")} ${message.translate("common:COUNT")}:** ${guild.emojis.cache.filter(emoji => !emoji.animated).size}`,
                `**● ${message.translate("common:ANIMATED")} ${message.translate("common:EMOJI")} ${message.translate("common:COUNT")}:** ${guild.emojis.cache.filter(emoji => emoji.animated).size}`,
                `**● ${message.translate("common:MEMBER")} ${message.translate("common:COUNT")}:** ${guild.memberCount}`,
                `**● ${message.translate("common:HUMANS")}:** ${guild.members.cache.filter(member => !member.user.bot).size}`,
                `**● ${message.translate("common:BOTS")}:** ${guild.members.cache.filter(member => member.user.bot).size}`,
                `**● ${message.translate("common:TEXT")} ${message.translate("common:CHANNELS")}:** ${guild.channels.cache.filter(channel => channel.type === "text").size}`,
                `**● ${message.translate("common:VOICE")} ${message.translate("common:CHANNELS")}:** ${guild.channels.cache.filter(channel => channel.type === "voice").size}`,
                `**● ${message.translate("common:MIVC")}:** <a:giphy_3:744676992141623399> ${count}`,
                `**● ${message.translate("common:MEMBER")} ${message.translate("common:PRESENCES")}:**\n> <:online:741196747748933682> ${totalOnline}\n> <:idle:741197218861678644> ${totalIdle}\n> <:dnd:741196524238667846> ${totalDND}\n> <:offline:741197268123648020> ${totalOffline}`,
                `\u200b`
            ])
            .addField(`**❯ ${message.translate("common:FEATURES")}:**`, [
                `\`${feature.length ? feature.map(ft => features[ft]).join(", ") : "None"}\``,
                `\u200b`
            ]);

            return message.channel.send(embed);

        });

    }

}

module.exports = Serverinfo;
