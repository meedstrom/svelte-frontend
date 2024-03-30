// An old redirect because page URLs used to be /posts/slug (until Sep 2023)

export const prerender = false
export const ssr = false

import { get as stored } from "svelte/store"
import { error, redirect } from "@sveltejs/kit"
import { pubMeta } from "$lib/stores"

export function load({ params }) {
    const post = [...stored(pubMeta).values()].find(
        (post) => post.slug === params.slug
    )
    if (post) redirect(307, `/${post.pageid}/${post.slug}`)
    else error(404, "Slug not found among public posts")
}
