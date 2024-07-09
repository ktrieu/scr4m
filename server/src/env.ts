type Config = {
	DATABASE_HOST: string;
	DATABASE_USER: string;
	DATABASE_PASSWORD: string;
	DATABASE_NAME: string;
	DATABASE_PORT: number;
	DATABASE_USE_SSL: boolean;
	SESSION_SECRET: string;
	PORT: number;
};

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

export const ENV_CONFIG: Config = {
	DATABASE_HOST: requiredString("DATABASE_HOST"),
	DATABASE_USER: requiredString("DATABASE_USER"),
	DATABASE_PASSWORD: requiredString("DATABASE_PASSWORD"),
	DATABASE_NAME: requiredString("DATABASE_NAME"),
	DATABASE_PORT: requiredNumber("DATABASE_PORT"),
	DATABASE_USE_SSL: requiredBool("DATABASE_USE_SSL"),
	SESSION_SECRET: requiredString("SESSION_SECRET"),
	PORT: requiredNumber("PORT"),
};
