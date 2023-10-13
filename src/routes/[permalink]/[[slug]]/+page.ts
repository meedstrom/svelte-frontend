export const prerender = false
// Why does SSR make edstrom.dev/nutrition load faster as measured by
// pagespeed.web.dev?  I would've thought it the other way around, or make no
// difference, because this should take almost no CPU time, making network
// requests the bottleneck.
// 
// export const ssr = false

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta } from '$lib/stores'

export function load({ params }) {
    let post

    post = get(privMeta).find(post => post.permalink === params.permalink)
    if (post)
        throw redirect(307, `/unlocked/${post.permalink}/${post.slug}`)

    // Redirect from /slug to /id/slug
    post = get(pubMeta).find(post => post.slug === params.permalink)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)

    throw error(404, 'Not found')

    // const post =
    //     get(privMeta).find(post => post.permalink === params.permalink) ??
    //     get(pubMeta).find(post => post.slug === params.permalink)

    // if (!post)
    //     throw error(404, 'Not found')
    // else if (get(allowedTags).length > 0)
    //     throw redirect(307, `/unlocked/${post.permalink}/${post.slug}`)
    // else
    //     throw redirect(307, `/${post.permalink}/${post.slug}`)
}
