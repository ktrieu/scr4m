import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const port = Number.parseInt(env.VITE_PORT);

	return {
		plugins: [react(), TanStackRouterVite()],
		server: {
			port,
		},
		optimizeDeps: {
			exclude: ["@scr4m/common"],
		},
		resolve: {
			alias: {
				"@public": "",
			},
		},
	};
});
