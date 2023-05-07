import 'dotenv/config'

import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import {
	GatewayDispatchEvents,
	GatewayIntentBits,
	InteractionType,
	Client
} from '@discordjs/core';

import express from 'express';

import * as pingCommand from './commands/ping.mjs';
import * as takeAwayCommand from './commands/take-away.mjs';

const port = process.env.PORT || 8080;
const expressServer = express();
expressServer.get('/', function(req, res){
	res.send("Hello world!");
});
expressServer.listen(port, () => {
  console.log('Listening on port', port);
});

const DISCORD_APP_ID = '1104743015572066344';
const COMMANDS = [
	pingCommand,
	takeAwayCommand
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
			console.log('Replying to command', command.name);

			try {
				await api.interactions.reply(
					interaction.id,
					interaction.token,
					{
						content: command.getReply({data: interaction, api}) || '[no reply]',
						// flags: MessageFlags.Ephemeral
					}
				)
			} catch(error) {
				console.error(error);
			}
		}
	}
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, async () => {
	const currentUser = await client.api.users.getCurrent();
	console.log('Ready and connected as', currentUser.username);

	try {
		for (const command of COMMANDS) {
			console.log('Registering command', command.name);

			await client.api.applicationCommands.createGlobalCommand(
				DISCORD_APP_ID,
				command.rawData,
			);
		}
	} catch(error) {
		console.error(error);
	}
});

// Start the WebSocket connection.
gateway.connect();