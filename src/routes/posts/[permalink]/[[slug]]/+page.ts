import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {
    const post =
        get(posts).find((post) => post.permalink === params.permalink) ??
        get(posts).find((post) => post.slug === params.permalink)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        throw error(404, 'Not found')
}
