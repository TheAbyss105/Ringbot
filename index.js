const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();


const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent]
});

//rdy

client.once('ready', () => {
	console.log('logged in as ${client.user.tag}');
});

client.on('messageCreate', message => {

	if (message.author.bot) return;

	if (message.content.toLowerCase() == 'hello') {
		message.reply('wsg you chud');
	}
});


client.login(process.env.DISCORD_TOKEN);
