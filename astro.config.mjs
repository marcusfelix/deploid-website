import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact()],
  output: "server",
  adapter: cloudflare({
    mode: 'directory'
  }),
  vite: {
    define: {
      'process.env.STRIPE_SECRET_KEY': JSON.stringify(process.env.STRIPE_SECRET_KEY),
      'process.env.STRIPE_WEBHOOK_SECRET': JSON.stringify(process.env.STRIPE_WEBHOOK_SECRET),
      'process.env.SLACK_TOKEN': JSON.stringify(process.env.SLACK_TOKEN),
      'process.env.SENDGRID_API_KEY': JSON.stringify(process.env.SENDGRID_API_KEY),
    }
  }
});