import 'dotenv/config'

import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import {
	GatewayDispatchEvents,
	GatewayIntentBits,
	InteractionType,
	Client
} from '@discordjs/core';

import * as pingCommand from './commands/ping.mjs';

const APP_ID = '1104743015572066344';
const COMMANDS = [
	pingCommand
];

// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const gateway = new WebSocketManager({
	token: process.env.DISCORD_TOKEN,
	intents: GatewayIntentBits.GuildMessages,
	rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API
client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
	for (const command of COMMANDS) {

		if (
			interaction.type === InteractionType.ApplicationCommand &&
			interaction.data.name === command.name
		) {
			await command.reply({ data: interaction, api });
		}

		// await client.api.applicationCommands.createGlobalCommand(
		// 	APP_ID,
		// 	command.rawData,
		// );
	}
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, async () => {
	const currentUser = await client.api.users.getCurrent();
	console.log('Ready and connected as', currentUser.username);

	for (const command of COMMANDS) {
		await client.api.applicationCommands.createGlobalCommand(
			APP_ID,
			command.rawData,
		);
	}
});

// Start the WebSocket connection.
gateway.connect();