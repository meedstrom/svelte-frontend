export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {
    const post =
        get(posts).find((post) => params.first === post.permalink) ??
        get(posts).find((post) => params.first === post.slug) ??
        get(posts).find((post) => params.second === post.slug)
    if (!post)
        throw error(404, 'Not found')
    else if (!post.hidden)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        return { post }
}
