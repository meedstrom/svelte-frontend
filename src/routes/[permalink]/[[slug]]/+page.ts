export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts, postsMetadata } from '$lib/stores'

export function load({ params }) {
    const post =
        get(posts).find((post) => params.permalink === post.permalink) ??
        get(posts).find((post) => params.permalink === post.slug) ??
        get(posts).find((post) => params.slug === post.slug) ??
        get(postsMetadata).find((post) => params.permalink === post.permalink) ??
        get(postsMetadata).find((post) => params.permalink === post.slug) ??
        get(postsMetadata).find((post) => params.slug === post.slug)
    if (!post)
        throw error(404, 'Not found')
    else if (!post.hidden)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        return { post }
}
