const { SlashCommandBuilder } = require('discord.js');
const { permits } = require('../../util/storage');


module.exports = {
        data: new SlashCommandBuilder()
                .setName('permit')
                .setDescription('Permits another user to ring you')
                .addUserOption((option) => option.setName('target').setDescription('the user'))
                .addIntegerOption((option) => option.setName('time').setDescription('for how long')),
        async execute(interaction) {
                const target = interaction.options.getUser('target');
                const time = interaction.options.getInteger('time');
//                await interaction.reply(`pretend ${target.username} was permitted for ${time}`);
		const user = interaction.user;
		const minutes = time
		const expiresAt = Date.now() + minutes * 60 * 1000;

		permits.push({
			userId: target.id,
			grantedBy: user.id,
			expiresAt
		});
		await interaction.reply({ content: "given", flags: 64});
        }
}
