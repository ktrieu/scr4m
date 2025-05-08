import type { Kysely } from "kysely";
import type PublicSchema from "../schemas/public/PublicSchema.js";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { ENV_CONFIG } from "../env.js";

type DiscordBot = {
	db: Kysely<PublicSchema>;
	client: Client<true>;
};

export const createDiscordBot = async (
	db: Kysely<PublicSchema>,
): Promise<DiscordBot> => {
	const client = new Client({
		intents: [GatewayIntentBits.Guilds],
	});

	client.login(ENV_CONFIG.DISCORD_BOT_TOKEN);

	return new Promise((resolve, reject) => {
		client.once(Events.ClientReady, (readyClient) => {
			const bot = {
				db,
				client: readyClient,
			};
			console.log("Discord bot ready!");
			resolve(bot);
		});
	});
};
