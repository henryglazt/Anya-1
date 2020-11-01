module.exports = class {
	constructor (client) {
		this.client = client;
	}

	async run (oldState, newState) {
    
    const client = this.client;
    
		const player = client.manager.players.get(newState.guild.id)

    if(!player) return;

    const channel = client.channels.cache.get(player.textChannel)
    
    let chnl = player.options.voiceChannel

    let guild = player.options.guild

    if(client.guilds.cache.get(guild).channels.cache.get(chnl).members.size == 1) {
        channel.send("im alone, im leaving...")
        return player.destroy()
    }
	}
};