import { SlashCommandBuilder } from '@discordjs/builders';

const name = 'ping';

const command = new SlashCommandBuilder()
	.setName(name)
	.setDescription('Check if this interaction is responsive')

// Get the raw data that can be sent to Discord
const rawData = command.toJSON();

function getReply({ data: interaction, api }) {
  return 'Pong';
}

export {
  name,
  rawData,
  getReply
}