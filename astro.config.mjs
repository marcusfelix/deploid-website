import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

import preact from "@astrojs/preact";

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
      'process.env.CUSTOMER_PORTAL_URL': JSON.stringify(process.env.CUSTOMER_PORTAL_URL),
      'process.env.SLACK_TOKEN': JSON.stringify(process.env.SLACK_TOKEN),
      'process.env.SENDGRID_API_KEY': JSON.stringify(process.env.SENDGRID_API_KEY),
      'process.env.SLACK_INVITE_LINK': JSON.stringify(process.env.SLACK_INVITE_LINK),
      'process.env.DESIGN_PRODUCT_URL': JSON.stringify(process.env.DESIGN_PRODUCT_URL),
      'process.env.CODE_PRODUCT_URL': JSON.stringify(process.env.CODE_PRODUCT_URL),
    }
  }
});