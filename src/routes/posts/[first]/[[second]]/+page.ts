export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {
    const post =
        get(posts).find((post) => post.permalink === params.first) ??
        get(posts).find((post) => post.slug === params.first)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        throw error(404, 'Not found')
}
