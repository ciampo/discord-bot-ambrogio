import {
	InteractionType,
	MessageFlags,
} from '@discordjs/core';

import { SlashCommandBuilder } from '@discordjs/builders';

const name = 'menu';

const options = [
	{name: 'pizza', weight: 3},
	{name: 'burger', weight: 3},
	{name: 'indiano', weight: 3},
	{name: 'pizza & burger', weight: 1},
];

const compoundOptions = options.reduce((acc, current) => {
	for (let i = 0; i < current.weight ?? 1; i++) {
		acc.push(current.name);
	}

	return acc;
}, []);

console.log(compoundOptions);


// Function to generate random number (min included, max excluded)
function generateRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}


const command = new SlashCommandBuilder()
	.setName(name)
	.setDescription('Decide cosa managiare per cena')

// Get the raw data that can be sent to Discord
const rawData = command.toJSON();

async function reply({ data: interaction, api }) {
  if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name !== name) {
		return;
	}

	const randomIndex = generateRandomInt(0, compoundOptions.length);

	await api.interactions.reply(
		interaction.id,
		interaction.token,
		{
			content: compoundOptions[randomIndex],
			flags: MessageFlags.Ephemeral
		}
	);
}

export {
  name,
  rawData,
  reply
}