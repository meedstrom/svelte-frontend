export const prerender = false
export const ssr = false

import { redirect } from "@sveltejs/kit"
import { get as stored } from "svelte/store"
import { pubMeta, privMeta, seen } from "$lib/stores"

export function load() {
    const allMeta = [...stored(pubMeta).values(), ...stored(privMeta).values()]
    let links = new Set<string>(
        // IDEA: Actually do permit showing the stubs and stuff, just after the
        // rest are exhausted
        allMeta
            .filter(
                (x) => !x.tags.includes("stub") && !x.tags.includes("daily")
            )
            .map((x) => x.pageid)
    )
    // maybe reset once seen all
    // TODO: don't only do this on the /random route!
    // TODO: check that the actual ids still exist in privMeta or pubMeta (maybe when the store is initalized) and don't belong to dailies
    if (links.size <= stored(seen).size) {
        // TODO: Check if there are public pages not yet in seen (because
        // visitor had also seen unlocked posts in the past, or posts deleted,
        // or stubs, or...)
        // if (!links.find(link => !stored(seen).has(link))) {
        alert(
            "Congrats, you've seen all public pages that aren't stubs! Counter reset."
        )
        seen.set(new Set<string>([]))
        // }
    }

    // NOTE: set-difference coming soon: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference#browser_compatibility
    for (const seenLink of stored(seen)) {
        links.delete(seenLink)
    }
    const unseen = [...links] // convert Set to array
    const randomPageId = unseen[Math.floor(Math.random() * unseen.length)]
    const randomPost = allMeta.find((x) => x.pageid === randomPageId)
    const slug = randomPost ? randomPost.slug : ""
    redirect(307, `/${randomPageId}/${slug}`)
}
