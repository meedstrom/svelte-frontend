export const prerender = false
// Why does SSR make edstrom.dev/nutrition load FASTER as measured by
// pagespeed.web.dev?  I would've thought it the other way around, or make no
// difference, because this should take almost no CPU time, making network
// requests the bottleneck.
// 
// export const ssr = false

import { get as stored } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta } from '$lib/stores'

export function load({ params }) {
    let post

    // If user is logged-in, redirect to the unlocked variant page
    post = stored(privMeta).get(params.first)
    if (post)
        throw redirect(307, `/unlocked/${post.permalink}/${post.slug}`)

    // Redirect from /slug to /id/slug
    post = [...stored(pubMeta).values()].find(post => post.slug === params.first)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)

    // Redirect from old 7-char ids to new 3-char ids
    post = stored(pubMeta).get(params.first.slice(4))

    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)

    throw error(404, 'Not found')
}
