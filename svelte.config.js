// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
// import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
    // preprocess: preprocess({    sourceMap: true,  }),

    // Default true already, something else needs enabling
    // compilerOptions: {
    //     enableSourcemap: true,
    // },
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({ precompress: true,  }),
        // adapter: adapter({ precompress: true, polyfill: false }),
        // csp: { directives: { 'script-src': ['self'] }, },
        prerender: {
            // handleHttpError: 'warn',
            handleMissingId: 'warn',
        },
    },
};

export default config;
