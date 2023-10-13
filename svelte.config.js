import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'

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
                'script-src': ['self'],
                'object-src': ['none'],
                'base-uri': ['none'],
            },
        },
        prerender: {
            // handleHttpError: 'warn',
            // handleMissingId: 'warn',
        },
    },
}

export default config
