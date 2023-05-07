import {
	InteractionType,
	MessageFlags,
} from '@discordjs/core';

import { SlashCommandBuilder } from '@discordjs/builders';

const name = 'ping';

const command = new SlashCommandBuilder()
	.setName(name)
	.setDescription('Check if this interaction is responsive')

// Get the raw data that can be sent to Discord
const rawData = command.toJSON();

async function reply({ data: interaction, api }) {
  if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name !== name) {
		return;
	}

	await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!', flags: MessageFlags.Ephemeral });
}

export {
  name,
  rawData,
  reply
}