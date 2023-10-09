export const prerender = true

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta } from '$lib/stores'
import { pubPosts } from '$lib/postContents'

export function load({ params }) {
    const content = get(pubPosts).get(params.permalink)
    const post = get(pubMeta).find(post => post.permalink === params.permalink)

    // const dailies: Post[] = post.tags.includes('daily') ? get(posts).filter(post =>
    //     post.tags.includes('daily')) : null
    // const dailySlugs = dailies.length === 0 ? dailies.map(post => post.slug) : null
    // const prev = dailySlugs ? dailies.find(post =>
    //     dailySlugs.indexOf(post.slug) > dailySlugs.indexOf(data.post.slug)) : null
    // const next = dailySlugs ? dailies.toReversed().find(post =>
    //     dailySlugs.indexOf(post.slug) < dailySlugs.indexOf(data.post.slug)) : null

    if (post) return { post, content }
    else throw error(404, 'Not found')
}
