export const prerender = true

import { redirect } from '@sveltejs/kit'
export function load() {
    throw redirect(307, '/all')
}
