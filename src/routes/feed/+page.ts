export const prerender = true
import { redirect } from "@sveltejs/kit"
import { assets } from "$app/paths"

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
    redirect(307, `${assets}/posts.atom`)
}
