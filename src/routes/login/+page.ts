export const prerender = false
export const ssr = false
import extra from '$lib/extraPosts.bin'
import { publicPosts } from '$lib/stores'
import { get } from 'svelte/store'

export async function load({ fetch }) {
    return {
        publicPosts: get(publicPosts),
        extraBlob: await fetch(extra).then((x: Response) => x.arrayBuffer())
    }
}
