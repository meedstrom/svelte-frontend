export const prerender = false
export const ssr = false // i worry that ssr slows down the redirect

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta, privMeta, pubSlugAssocs } from '$lib/stores'

export function load({ params }) {
    const post =
        get(privMeta).find(post => post.permalink === params.permalink) ??
        get(pubMeta).find(post => post.slug === params.permalink)

    if (!post)
        throw error(404, 'Not found')
    else if (post.hidden)
        throw redirect(307, `/unlocked/${post.permalink}/${post.slug}`)
    else
        throw redirect(307, `/${post.permalink}/${post.slug}`)
}
