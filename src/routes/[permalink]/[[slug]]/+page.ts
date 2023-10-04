export const prerender = true

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {

    const post = get(posts).find((post) => post.permalink === params.permalink)

    // const dailies: Post[] = post.tags.includes('daily') ? get(posts).filter(post =>
    //     post.tags.includes('daily')) : null
    // const dailySlugs = dailies.length === 0 ? dailies.map(post => post.slug) : null
    // const prev = dailySlugs ? dailies.find(post =>
    //     dailySlugs.indexOf(post.slug) > dailySlugs.indexOf(data.post.slug)) : null
    // const next = dailySlugs ? dailies.toReversed().find(post =>
    //     dailySlugs.indexOf(post.slug) < dailySlugs.indexOf(data.post.slug)) : null

    // if (post && post.hidden) {
    //     // Redirect to non-prerendered subdir
    //     throw redirect(307, `/${post.permalink}/private/${post.slug}`)
    // }
    if (post) {
        return {
            post: post,
        }
    }
    else {
        // If a known permalink wasn't found, most likely I typed the URL
        // skipping the page ID altogether, so seek a match among known slugs.
        // Love this convenience.
        const otherPost = get(posts).find((post) => post.slug === params.permalink)
        if (otherPost)
            throw redirect(307, `/${otherPost.permalink}/${otherPost.slug}`)
        else
            throw error(404, 'Not found')
    }
}
