import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { cloudflare } from "@cloudflare/vite-plugin";
import { mochaPlugins } from "@getmocha/vite-plugins";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	  plugins: [
	    ...mochaPlugins(process.env as any),
	    react(),
	    // cloudflare({
	    //   auxiliaryWorkers: [{ configPath: "/mocha/emails-service/wrangler.json" }],
	    // }),
	  ],
	  server: {
	    allowedHosts: true,
	    proxy: {
	      '/admin-api': {
	        target: 'http://localhost:8080',
	        changeOrigin: true,
	        rewrite: (path) => path.replace(/^\/admin-api/, '/api'),
	      },
	    },
	  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
