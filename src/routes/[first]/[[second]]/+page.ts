export const prerender = false
// Why does SSR make edstrom.dev/nutrition load FASTER as measured by
// pagespeed.web.dev?  I would've thought it the other way around, or make no
// difference, because this should take almost no CPU time, making network
// requests the bottleneck.
//
// export const ssr = false

import { get as stored } from "svelte/store"
import { error, redirect } from "@sveltejs/kit"
import { privMeta } from "$lib/stores"

export function load({ params, url }) {
    let post

    // (url.hash is not available during load, but oddly we can still grab it
    // from url.href)
    // Will need it to make the hash-part survive a redirect
    const hashfrag = url.href.split("#")[1]
    const hash = hashfrag ? "#" + hashfrag : ""

    // Trying to access a hidden ID?  Go to /unlocked.
    post = stored(privMeta).get(params.first)
    if (post) redirect(308, `/unlocked/${post.pageid}/${post.slug}${hash}`)

    error(404, "Hidden or not found")
}
