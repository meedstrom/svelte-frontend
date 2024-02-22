export const prerender = false
// Why does SSR make edstrom.dev/nutrition load FASTER as measured by
// pagespeed.web.dev?  I would've thought it the other way around, or make no
// difference, because this should take almost no CPU time, making network
// requests the bottleneck.
//
// export const ssr = false

import idMappings from "$lib/idMappings.json"
import idsInPages from "$lib/idsInPages.json"
import { get as stored } from "svelte/store"
import { error, redirect } from "@sveltejs/kit"
import { pubMeta, privMeta } from "$lib/stores"

export function load({ params }) {
    let post

    // Trying to access a hidden ID?  Go to /unlocked.
    post = stored(privMeta).get(params.first)
    if (post) redirect(307, `/unlocked/${post.permalink}/${post.slug}`);

    // Redirect from /slug to /id/slug
    const slugMaybe = params.first
    post =
        [...stored(pubMeta).values()].find((post) => post.slug === slugMaybe) ??
        [...stored(privMeta).values()].find((post) => post.slug === slugMaybe)
    if (post) redirect(307, `/${post.permalink}/${post.slug}`);

    // Redirect from v1 id (7-char base62) to v2 id (4-char base62).
    const oldID =
        params.first.length === 7 ? params.first.slice(3) : params.first

    // Redirect from v2 to v3 id
    post =
        stored(pubMeta).get(idMappings[`${oldID}`]) ??
        stored(privMeta).get(idMappings[`${oldID}`])
    if (post) redirect(307, `/${post.permalink}/${post.slug}`);

    // Redirect from an ID that has since become a subheading in another page
    const idMaybe = params.first
    post =
        stored(pubMeta).get(idsInPages[`${idMaybe}`]) ??
        stored(privMeta).get(idsInPages[`${idMaybe}`])
    if (post) redirect(307, `/${post.permalink}/${post.slug}#${idMaybe}`);

    error(404, "Not found");
}
