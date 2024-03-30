export const prerender = false
export const ssr = false

import { redirect } from "@sveltejs/kit"
import { get as stored } from "svelte/store"
import { pubMeta, privMeta, seen } from "$lib/stores"

export function load() {
    const allMeta = [...stored(pubMeta).values(), ...stored(privMeta).values()]
    let links = new Set<string>(
        allMeta.filter((x) => !x.tags.includes("stub")).map((x) => x.pageid)
    )
    // maybe reset once seen all
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
