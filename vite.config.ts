import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [sveltekit()],
    assetsInclude: ["**/*.bin", "**/*.gpg", "**/*.xml"],
    build: { sourcemap: true },
})
