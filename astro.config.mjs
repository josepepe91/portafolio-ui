import { defineConfig } from 'astro/config';

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://josepepe91.github.io',
  base: '/',
  integrations: [preact()]
});