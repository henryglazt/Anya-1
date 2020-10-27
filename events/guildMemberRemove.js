const Canvas = require("canvas"),
	Discord = require("discord.js");
const { resolve } = require("path");
// Register assets fonts
Canvas.registerFont(resolve("./assets/fonts/theboldfont.ttf"), { family: "Bold" });
Canvas.registerFont(resolve("./assets/fonts/SketchMatch.ttf"), { family: "SketchMatch" });

const applyText = (canvas, text, defaultFontSize) => {
	const ctx = canvas.getContext("2d");
	do {
		ctx.font = `${defaultFontSize -= 10}px Bold`;

	} while (ctx.measureText(text).width > 350);
	return ctx.font;
};

module.exports = class {

	constructor (client) {
		this.client = client;
	}
  
	async run (member) {

		member.guild.fetch().then(async (guild) => {

			const guildData = await this.client.findOrCreateGuild({ id: guild.id });
			member.guild.data = guildData;

			// Check if goodbye message is enabled
			if(guildData.plugins.goodbye.enabled){
				const channel = guild.channels.cache.get(guildData.plugins.goodbye.channel);
				if(channel){
					const message = guildData.plugins.goodbye.message
						.replace(/{user}/g, member.user.tag)
						.replace(/{server}/g, guild.name)
						.replace(/{membercount}/g, guild.memberCount);
					if(guildData.plugins.goodbye.withImage){
						const canvas = Canvas.createCanvas(1024, 450),
							ctx = canvas.getContext("2d");
                    
						var images = guildData.goodbyeImage;
						let background;
						if(images.length <=0){
							background = await Canvas.loadImage("./assets/img/greetings.jpeg");
						} else {
							var imx = Math.floor(Math.random() * images.length);
							background = await Canvas.loadImage(images[imx]);
						}
						// This uses the canvas dimensions to stretch the image onto the entire canvas
						ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
						// Draw # for discriminator
						ctx.fillStyle = "#44d14a";
						ctx.shadowColor = "BLACK";
						ctx.shadowBlur = 5;
						ctx.font = "75px SketchMatch";
						ctx.fillText("#", canvas.width - 170, canvas.height - 138);
						// Draw Title with gradient
						ctx.font = "90px Bold";
						ctx.strokeStyle = "#1d2124";
						ctx.lineWidth = 15;
						ctx.strokeText(member.guild.translate("administration/goodbye:TITLE"), canvas.width - 430, canvas.height - 340);
						var gradient = ctx.createLinearGradient(canvas.width - 590, 0, canvas.width - 30, 0);
						gradient.addColorStop(0, "#e15500");
						gradient.addColorStop(1, "#e7b121");
						ctx.fillStyle = gradient;
						ctx.fillText(member.guild.translate("administration/goodbye:TITLE"), canvas.width - 430, canvas.height - 340);
						// Draw username
						ctx.fillStyle = "WHITE";
						ctx.shadowColor = "BLACK";
						ctx.shadowBlur = 10;
						ctx.textAlign = "right";
						ctx.font = applyText(canvas, member.user.username, 70);
						ctx.fillText(member.user.username, canvas.width - 20, canvas.height - 218);
						// Draw discriminator
						ctx.font = "40px Bold";
						ctx.fillStyle = "WHITE";
						ctx.shadowColor = "BLACK";
						ctx.shadowBlur = 10;
						ctx.fillText(member.user.discriminator, canvas.width - 20, canvas.height - 150);
						// Draw number
						ctx.font = "26px Bold";
						ctx.fillStyle = "WHITE";
						ctx.shadowColor = "BLACK";
						ctx.shadowBlur = 5;
						ctx.fillText(member.guild.translate("administration/welcome:IMG_NB", {
							memberCount: member.guild.memberCount
						}), canvas.width - 20, canvas.height - 30);
                
						// Pick up the pen
						ctx.beginPath();
						//Define Stroke Line
						ctx.lineWidth = 10;
						//Define Stroke Style
						ctx.strokeStyle = "BLACK";
						ctx.shadowColor = "BLACK";
						ctx.shadowBlur = 10;
						// Start the arc to form a circle
						ctx.arc(512, 225, 135, 0, Math.PI * 2, true);
						// Draw Stroke
						ctx.stroke();
						// Put the pen down
						ctx.closePath();
						// Clip off the region you drew on
						ctx.clip();
                    
						const options = { format: "png", size: 512 },
							avatar = await Canvas.loadImage(member.user.displayAvatarURL(options));
						// Move the image downwards vertically and constrain its height to 200, so it"s a square
						ctx.drawImage(avatar, 377, 90, 270, 270);

						const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "goodbye-image.png");
						channel.send(message, attachment);
					} else {
						channel.send(message);
					}
				}
			}

		});
	}
};
