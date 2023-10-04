export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {
    const post = get(posts).find((post) => post.permalink === params.permalink)

    if (post) return {
        post: post,
    }
    else {
        throw error(404, 'Not found')
    }
}
