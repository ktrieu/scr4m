import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	ButtonStyle,
	ChannelType,
	Client,
	Events,
	GatewayIntentBits,
	type Guild,
	MessageFlags,
	SeparatorBuilder,
	SeparatorSpacingSize,
	type TextChannel,
	TextDisplayBuilder,
} from "discord.js";
import { ENV_CONFIG, envIsDev } from "../env.js";

const BUTTON_VOTE_YES = "button-vote-yes";
const BUTTON_VOTE_NO = "button-vote-no";

const getButtonId = (id: string) => {
	return `${ENV_CONFIG.ENVIRONMENT}-${id}`;
};

type ScrumVoteHandler = (
	available: boolean,
	messageId: string,
	userId: string,
) => Promise<void>;

export type DiscordBot = {
	client: Client<true>;
	server: Guild;
	channel: TextChannel;
	scrumVoteHandlers: ScrumVoteHandler[];
};

const handleButtonInteraction = async (
	bot: DiscordBot,
	interaction: ButtonInteraction,
) => {
	let available: boolean;
	if (interaction.customId === getButtonId(BUTTON_VOTE_YES)) {
		available = true;
	} else if (interaction.customId === getButtonId(BUTTON_VOTE_NO)) {
		available = false;
	} else {
		console.warn(
			`Unrecognized button interaction. Custom ID: ${interaction.customId}`,
		);
		return;
	}

	await interaction.deferUpdate();

	const messageId = interaction.message.id;
	const userId = interaction.user.id;

	for (const handler of bot.scrumVoteHandlers) {
		try {
			await handler(available, messageId, userId);
		} catch (e) {
			console.error(
				`Error from scrum vote handler: ${e}. Continuing with next handler.`,
			);
		}
	}
};

export const createDiscordBot = async (): Promise<DiscordBot> => {
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

	const bot = {
		client: readyClient,
		server,
		channel,
		scrumVoteHandlers: [],
	};

	client.on("interactionCreate", async (interaction) => {
		if (interaction.isButton()) {
			await handleButtonInteraction(bot, interaction);
		} else {
			console.warn(`Unrecognized interaction: ${interaction.type}`);
		}
	});

	return bot;
};

export const addScrumVoteHandler = (
	bot: DiscordBot,
	handler: ScrumVoteHandler,
) => {
	bot.scrumVoteHandlers.push(handler);
};

export const sendScrumMessage = async (bot: DiscordBot) => {
	let message =
		"@everyone\n\nUGO-BOT SCRUMMONS: Vote if you are available for scrum!";

	if (envIsDev()) {
		message += "\nDEBUG";
	}

	const text = new TextDisplayBuilder().setContent(message);

	const separator = new SeparatorBuilder()
		.setSpacing(SeparatorSpacingSize.Large)
		.setDivider(true);

	const yesButton = new ButtonBuilder()
		.setCustomId(getButtonId(BUTTON_VOTE_YES))
		.setEmoji("👍")
		.setStyle(ButtonStyle.Success);

	const noButton = new ButtonBuilder()
		.setCustomId(getButtonId(BUTTON_VOTE_NO))
		.setEmoji("👎")
		.setStyle(ButtonStyle.Danger);

	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		yesButton,
		noButton,
	);

	return bot.channel.send({
		components: [text, separator, actionRow],
		flags: MessageFlags.IsComponentsV2,
	});
};
