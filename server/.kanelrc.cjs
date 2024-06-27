const { makeKyselyHook } = require("kanel-kysely");

// Edit our generated import statements to match ESM import syntax.
// Shoutout to this GitHub comment: https://github.com/kristiandupont/kanel/issues/436#issuecomment-2134192919
const verbatimModuleSyntaxHook = (_, lines) =>
	lines.map((line) => {
		let x = line;

		if (x.startsWith("import {")) {
			x = x.replaceAll("type ", "").replace("import {", "import type {");

			if (x.includes("default as") && !x.includes(", ")) {
				x = x.replace("{ default as ", "").replace("} ", "");
			}

			if (x.includes("./")) x = x.replace("';", ".js';");
		} else if (
			x.startsWith("export default") &&
			!x.startsWith("export default interface")
		) {
			x = x
				.replace("export default", "export type {")
				.replace(";", " as default };");
		}

		return x;
	});

module.exports = {
	connection: {
		// This is intended to run outside of Docker in local dev.
		host: "localhost",
		user: process.env.PSQL_USERNAME,
		password: process.env.PSQL_PASSWORD,
		database: process.env.PSQL_DB,
		port: process.env.PSQL_PORT,
	},

	preDeleteOutputFolder: true,
	outputPath: "./src/schemas",

	preRenderHooks: [makeKyselyHook()],
	postRenderHooks: [verbatimModuleSyntaxHook],
};
