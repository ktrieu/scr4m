import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const port = parseInt(env.VITE_PORT)

  return {
    plugins: [react()],
    server: {
      port,
    },
    optimizeDeps: {
      include: ["@scr4m/common"]
    },
  }
})
