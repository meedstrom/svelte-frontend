export const prerender = true
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    throw redirect(307, '/')
}
