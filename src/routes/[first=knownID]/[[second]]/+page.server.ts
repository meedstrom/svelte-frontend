export const prerender = true

import { get as stored } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta } from '$lib/stores'
import { pubPosts } from '$lib/postContents'

export function load({ params }) {
    const content = stored(pubPosts).get(params.first)
    const post = stored(pubMeta).get(params.first)

    if (post) return { post, content, id: post.permalink, }
    else throw error(404, 'Known ID, but post not found')
}
