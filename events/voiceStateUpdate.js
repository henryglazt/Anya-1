module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (oldState, newState) {
    
    const client = this.client;
    
    const player = client.manager.players.get(newState.guild.id);

    if(!player) return;

    const channel = client.channels.cache.get(player.textChannel);
    
    let chnl = player.voiceChannel;

    let guild = player.guild;

    if(client.guilds.cache.get(guild).channels.cache.get(chnl).members.filter(m => !m.user.bot).size < 1) {
        channel.send(newState.guild.translate("music/stop:LEAVE"));
        return player.destroy()
    }
	}
};
