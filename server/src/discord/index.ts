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
import { ENV_CONFIG } from "../env.js";

const BUTTON_VOTE_YES = "button-vote-yes";
const BUTTON_VOTE_NO = "button-vote-no";

type DiscordBotEventHandlers = {
	onScrumVote?: (
		available: boolean,
		messageId: string,
		userId: string,
	) => Promise<void>;
};

type DiscordBot = {
	client: Client<true>;
	server: Guild;
	channel: TextChannel;
	handlers: DiscordBotEventHandlers;
};

const handleButtonInteraction = async (
	interaction: ButtonInteraction,
	handlers: DiscordBotEventHandlers,
) => {
	let available: boolean;
	if (interaction.customId === BUTTON_VOTE_YES) {
		available = true;
	} else if (interaction.customId === BUTTON_VOTE_NO) {
		available = false;
	} else {
		console.warn(
			`Unrecognized button interaction. Custom ID: ${interaction.customId}`,
		);
		return;
	}

	const messageId = interaction.message.id;
	const userId = interaction.user.id;

	if (handlers.onScrumVote) {
		await handlers.onScrumVote(available, messageId, userId);
	}
};

export const createDiscordBot = async (
	handlers: DiscordBotEventHandlers,
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

	client.on("interactionCreate", async (interaction) => {
		if (interaction.isButton()) {
			await interaction.deferUpdate();
			await handleButtonInteraction(interaction, handlers);
		} else {
			console.warn(`Unrecognized interaction: ${interaction.type}`);
		}
	});

	const bot = {
		client: readyClient,
		server,
		channel,
		handlers,
	};

	return bot;
};

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
