export const prerender = true

import { get as stored } from "svelte/store"
import { error } from "@sveltejs/kit"
import { pubMeta } from "$lib/stores"
import { pubPosts } from "$lib/postContents"

export function load({ params }) {
    const content = stored(pubPosts).get(params.first)
    const post = stored(pubMeta).get(params.first)

    if (post)
        return {
            // post, content, id: post.pageid, dailies: [], dailySlugs: []
            post,
            content,
            id: post.pageid,
        }
    else error(404, "Known ID, but post not found")
}
