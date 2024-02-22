export const prerender = false
export const ssr = false

import { get as stored } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta, allowedTags } from '$lib/stores'
import { pubPosts, privPosts } from '$lib/postContents'

export function load({ params }) {
    const post =
        stored(pubMeta).get(params.first) ??
        stored(privMeta).get(params.first) ??
        [...stored(pubMeta).values()].find((post) => post.slug === params.first) ??
        [...stored(privMeta).values()].find((post) => post.slug === params.first)
    if (post) {
        // User is logged in
        if (stored(allowedTags).length > 0) {
            let content = stored(pubPosts).get(post.permalink) ?? stored(privPosts).get(post.permalink)
            const dailies = [...stored(privMeta).values()]
                                .filter(post => post.tags.includes('daily'))
                                .sort((a, b) => b.created.localeCompare(a.created))
            const dailySlugs = dailies.map(post => post.slug)
            return { post, content, id: post.permalink, dailies, dailySlugs }
        }
        // User is not logged in (and probably trying to access a known pageid)
        else {
            redirect(307, `/${post.permalink}/${post.slug}`);
        }
    }
    else redirect(307, `/${params.first}/${params.second}`);
    console.log(`redirecting to ${params.first}`)
    // else throw error(404, 'Not found')
}
