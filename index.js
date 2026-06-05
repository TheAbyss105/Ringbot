const { Client, Collection, Events, MessageFlags, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent]
});

const { activeRings } = require('./util/storage');

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands', 'utility');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

const data = new SlashCommandBuilder().setName('permit')
                .setDescription('Permits another user to ring you')
                .addUserOption((option) => option.setName('target').setDescription('the user'))
                .addIntegerOption((option) => option.setName('time').setDescription('for how long'));




client.once('clientReady', () => {
	console.log(`logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {

	if (message.author.bot) return;

	if (message.content.toLowerCase() == "stop") {
		activeRings.set(message.author.id, false);
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({ content: 'Error running command', flags: 64 });
	}
});

client.login(process.env.DISCORD_TOKEN);
