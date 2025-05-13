import {
	ChannelType,
	Client,
	Events,
	GatewayIntentBits,
	type Guild,
	type TextChannel,
} from "discord.js";
import type { Kysely } from "kysely";
import { ENV_CONFIG } from "../env.js";
import type PublicSchema from "../schemas/public/PublicSchema.js";

type DiscordBot = {
	db: Kysely<PublicSchema>;
	client: Client<true>;
	server: Guild;
	channel: TextChannel;
};

export const createDiscordBot = async (
	db: Kysely<PublicSchema>,
): Promise<DiscordBot> => {
	const client = new Client({
		intents: [GatewayIntentBits.Guilds],
	});

	client.login(ENV_CONFIG.DISCORD_BOT_TOKEN);

	const readyClient = await new Promise<Client<true>>((resolve) => {
		client.once(Events.ClientReady, (readyClient) => {
			resolve(readyClient);
		});
	});

	const server = await readyClient.guilds.fetch(
		ENV_CONFIG.DISCORD_BOT_SERVER_ID,
	);
	const channel = await server.channels.fetch(
		ENV_CONFIG.DISCORD_BOT_CHANNEL_ID,
	);

	if (channel == null) {
		throw new Error(`Channel ${ENV_CONFIG.DISCORD_BOT_CHANNEL_ID} not found.`);
	}

	if (channel.type !== ChannelType.GuildText) {
		throw new Error(`Channel ${channel.name} is not text-based!`);
	}

	return {
		db,
		client: readyClient,
		server,
		channel,
	};
};

export const sendScrumMessage = async (bot: DiscordBot) => {
	await bot.channel.send("hello!");
};
