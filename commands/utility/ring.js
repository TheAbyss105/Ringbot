const { SlashCommandBuilder } = require('discord.js');
const { permits, startRing } = require('../../util/storage');


module.exports = {
        data: new SlashCommandBuilder()
                .setName('ring')
                .setDescription('spam ping that bozo -- WITH PERMISSION')
                .addUserOption((option) => option.setName('target').setDescription('target'))
                .addIntegerOption((option) => option.setName('time').setDescription('in how long')),
        async execute(interaction) {
                const target = interaction.options.getUser('target');
                const time = interaction.options.getInteger('time');
		const user = interaction.user;
//                await interaction.reply(`pretend ${target.username} was permitted for ${time}`);

		const permit = permits.find(p => p.userId === user.id && p.grantedBy === target.id);

		if (!permit) {
			return interaction.reply({
				content: "You dont have permission asshole",
				flags: 64
			});
		}
		
		if (permit.expiresAt < Date.now()) {
			return interaction.reply({
				content: "permission gone boi",
				flags: 64
			});
		}

		if (permit.expiresAt > Date.now()) {
			await startRing(target);
			return interaction.reply({
				content: "ok",
				flags: 64
			});
		}
        }
}
