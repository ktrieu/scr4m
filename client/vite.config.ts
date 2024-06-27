import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	const port = parseInt(env.VITE_PORT);

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
