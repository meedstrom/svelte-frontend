export const prerender = false
export const ssr = false

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta, allowedTags } from '$lib/stores'
import { pubPosts, privPosts } from '$lib/postContents'

export function load({ params }) {
    const post =
        get(pubMeta).find((post) => params.permalink === post.permalink) ??
        get(pubMeta).find((post) => params.permalink === post.slug) ??
        get(privMeta).find((post) => params.permalink === post.permalink) ??
        get(privMeta).find((post) => params.permalink === post.slug)
    if (post) {
        // User is logged in
        if (get(allowedTags).length > 0) {
            let content = get(pubPosts).get(post.permalink) ?? get(privPosts).get(post.permalink)
            return { post, content }
        }
        // User is not logged in
        else throw redirect(307, `/${post.permalink}/${post.slug}`)
    }
    else throw error(404, 'Not found')
}
