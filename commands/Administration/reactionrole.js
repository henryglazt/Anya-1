        const role = message.mentions.roles.first();
        if (!role)
            return message.reply('You need mention a role').then(m => m.delete({ timeout: 1_000 }));

        const emoji = client.emojis.resolveIdentifier(args[1])
        if (!emoji)
            return message.reply('You need use a valid emoji.').then(m => m.delete({ timeout: 1_000 }));

        const msg = await message.channel.messages.fetch(args[2] || message.id);
        if (!role)
            return message.reply('Message not found! Wtf...').then(m => m.delete({ timeout: 1_000 }));

        reactionRoleManager.addRole({
            message: msg,
            role,
            emoji
        });
        message.reply('Done').then(m => m.delete({ timeout: 500 }));
        message.delete();
