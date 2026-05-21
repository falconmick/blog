import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

const isCloudflareBuild = process.env.CLOUDFLARE_BUILD === "1";

export default defineConfig({
  integrations: [mdx()],

  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        jpeg: { quality: 100 },
        webp: { quality: 100 },
      },
    },
    layout: "constrained",
    objectFit: "contain",
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: isCloudflareBuild ? "workerd" : "node",
  }),
});
