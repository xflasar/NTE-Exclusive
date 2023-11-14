const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reply')
    .setDescription('Replies to the user with mention and reply.'),
  async execute(interaction) {
    return await interaction.reply(`${interaction.user.username} Hello!`)
  }
}