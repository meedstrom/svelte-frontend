// An old redirect because page URLs used to be /posts/slug (until Sep 2023)

export const prerender = false
export const ssr = false

import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { pubMeta } from '$lib/stores'

export function load({ params }) {
    const post = get(pubMeta).find(post => post.slug === params.slug)
    if (post)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        throw error(404, 'Not found')
}
