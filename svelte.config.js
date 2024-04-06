import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      precompress: true,
      polyfill: false,
    }),
    csp: {
      directives: {
        "script-src": ["self", "https://gc.zgo.at"],
        "connect-src": ["self", "https://edstromdev.goatcounter.com/count"],
        "object-src": ["none"],
        "base-uri": ["none"],
      },
    },
    prerender: {
      // handleHttpError: 'warn',
      handleMissingId: "warn",
    },
  },
}

export default config
