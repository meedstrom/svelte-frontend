export const prerender = false
export const ssr = false

import { get as stored } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta, allowedTags } from '$lib/stores'
import { pubPosts, privPosts } from '$lib/postContents'

export function load({ params }) {
    const post =
        stored(pubMeta).get(params.permalink) ??
        stored(privMeta).get(params.permalink) ??
        [...stored(pubMeta).values()].find((post) => params.permalink === post.slug) ??
        [...stored(privMeta).values()].find((post) => params.permalink === post.slug)
    if (post) {
        // User is logged in
        if (stored(allowedTags).length > 0) {
            let content = stored(pubPosts).get(post.permalink) ?? stored(privPosts).get(post.permalink)
            return { post, content, id: post.permalink }
        }
        // User is not logged in
        else throw redirect(307, `/${post.permalink}/${post.slug}`)
    }
    else throw error(404, 'Not found')
}
