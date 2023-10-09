export const prerender = false
export const ssr = false

import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { pubMeta, privMeta, seen } from '$lib/stores'

export function load() {
    const merged = [...get(pubMeta), ...get(privMeta)]
    let links = new Set<string>(
        merged.filter(x => !x.tags.includes('stub'))
            .map(x => x.permalink)
    )
    // maybe reset once seen all
    if (links.size <= get(seen).size) {
        // TODO: Check if there are public pages not yet in seen (because visitor had
        // also seen unlocked posts in the past, or posts deleted, or stubs, or...)
        // if (!links.find(link => !get(seen).has(link))) {
        alert('Congrats, you\'ve seen all public pages that aren\'t stubs! Counter reset.')
        seen.set(new Set<string>([]))
        // }
    }

    // NOTE: set-difference coming to JS:
    // https://github.com/tc39/proposal-set-methods
    for (const seenLink of get(seen)) {
        links.delete(seenLink)
    }
    const unseen = [...links] // convert Set to array
    const randomPermalink = unseen[Math.floor(Math.random() * unseen.length)]
    const randomPost = merged.find(x => x.permalink === randomPermalink)
    const slug = randomPost ? randomPost.slug : ''
    throw redirect(307, `/${randomPermalink}/${slug}`)
}
