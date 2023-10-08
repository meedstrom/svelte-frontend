export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { postsMetadata } from '$lib/stores'

export function load({ params }) {
    const post =
        get(postsMetadata).find((post) => post.permalink === params.first) ??
        get(postsMetadata).find((post) => post.slug === params.first)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        throw error(404, 'Not found')
}
