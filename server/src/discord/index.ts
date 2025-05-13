import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	Client,
	Events,
	GatewayIntentBits,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
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

const BUTTON_VOTE_YES = "button-vote-yes";
const BUTTON_VOTE_NO = "button-vote-no";

export const sendScrumMessage = async (bot: DiscordBot) => {
	const text = new TextDisplayBuilder().setContent(
		"@everyone\n\nUGO-BOT SCRUMMONS: Vote if you are available for scrum!",
	);

	const separator = new SeparatorBuilder()
		.setSpacing(SeparatorSpacingSize.Large)
		.setDivider(true);

	const yesButton = new ButtonBuilder()
		.setCustomId(BUTTON_VOTE_YES)
		.setEmoji("👍")
		.setStyle(ButtonStyle.Success);

	const noButton = new ButtonBuilder()
		.setCustomId(BUTTON_VOTE_NO)
		.setEmoji("👎")
		.setStyle(ButtonStyle.Danger);

	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		yesButton,
		noButton,
	);

	bot.channel.send({
		components: [text, separator, actionRow],
		flags: MessageFlags.IsComponentsV2,
	});
};
