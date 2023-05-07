import {
	InteractionType,
	MessageFlags,
} from '@discordjs/core';

import { SlashCommandBuilder } from '@discordjs/builders';

const name = 'menu';

const weighedFoodOptions = [
	{name: 'pizza', weight: 3},
	{name: 'burger', weight: 3},
	{name: 'indiano', weight: 3},
	{name: 'pizza & burger', weight: 1},
].reduce((acc, current) => {
	for (let i = 0; i < current.weight ?? 1; i++) {
		acc.push(current.name);
	}

	return acc;
}, []);

const prefixes = [
	'E a sto giro si mangia [OPTION]',
	'Ottima domanda! Per questa volta, dico [OPTION]',
	'E anche oggi si fa dieta domani, [OPTION] sia',
	'Ho proprio voglia di [OPTION]',
	'Il dottore mi ha consigliato [OPTION]',
	'Ho sentito dire che se scegli [OPTION] il DM ti fa salire di livello',
	'[OPTION] — non te l\'aspettavi, eh?',
]


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

	const foodOptionIndex = generateRandomInt(0, weighedFoodOptions.length);
	const prefixOptionIndex = generateRandomInt(0, prefixes.length);

	const sentence = prefixes[prefixOptionIndex].replace(
		'[OPTION]',
		weighedFoodOptions[foodOptionIndex].toUpperCase()
	);

	await api.interactions.reply(
		interaction.id,
		interaction.token,
		{
			content: sentence,
			flags: MessageFlags.Ephemeral
		}
	);
}

export {
  name,
  rawData,
  reply
}