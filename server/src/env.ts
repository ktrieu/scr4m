const requiredString = (key: string) => {
	const value = process.env[key];

	if (value === undefined || value === "") {
		throw new Error(`Environment variable ${key} was undefined or empty!`);
	}

	return value;
};

const requiredNumber = (key: string) => {
	const value = requiredString(key);

	const numValue = Number.parseInt(value, 10);

	if (Number.isNaN(numValue)) {
		throw new Error(`Environment variable ${key} was not a valid number!`);
	}

	return numValue;
};

const requiredBool = (key: string) => {
	const value = requiredString(key);

	switch (value) {
		case "true":
			return true;
		case "false":
			return false;
		default:
			throw new Error(`Environment variable ${key} was not a valid boolean!`);
	}
};

const requiredEnvEnum = (key: string): Environment => {
	const value = requiredString(key);

	if (value !== "dev" && value !== "prod") {
		throw new Error(`Invalid value for ENVIRONMENT: ${value}`);
	}

	return value;
};

type Environment = "dev" | "prod";

export const ENV_CONFIG = {
	ENVIRONMENT: requiredEnvEnum("ENVIRONMENT"),
	DATABASE_HOST: requiredString("DATABASE_HOST"),
	DATABASE_USER: requiredString("DATABASE_USER"),
	DATABASE_PASSWORD: requiredString("DATABASE_PASSWORD"),
	DATABASE_NAME: requiredString("DATABASE_NAME"),
	DATABASE_PORT: requiredNumber("DATABASE_PORT"),
	DATABASE_USE_SSL: requiredBool("DATABASE_USE_SSL"),
	SESSION_SECRET: requiredString("SESSION_SECRET"),
	USE_SECURE_SESSION_COOKIE: requiredBool("USE_SECURE_SESSION_COOKIE"),
	DISCORD_BOT_TOKEN: requiredString("DISCORD_BOT_TOKEN"),
	DISCORD_BOT_SERVER_ID: requiredString("DISCORD_BOT_SERVER_ID"),
	DISCORD_BOT_CHANNEL_ID: requiredString("DISCORD_BOT_CHANNEL_ID"),
	PORT: requiredNumber("PORT"),
} as const;

export const envIsDev = () => {
	return ENV_CONFIG.ENVIRONMENT === "dev";
};

export const envIsProd = () => {
	return ENV_CONFIG.ENVIRONMENT === "prod";
};
