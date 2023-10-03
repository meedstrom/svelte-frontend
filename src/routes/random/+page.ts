export const prerender = false
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { posts, seen } from '$lib/stores'

export function load() {
    let links = new Set<string>(
        // Filter out stub pages
        get(posts)
            .filter(x => !x.tags.includes('stub'))
            .map(x => x.permalink)
    )
    // NOTE: set-difference is coming to JS:
    // https://github.com/tc39/proposal-set-methods
    for (const seenLink of get(seen)) {
        links.delete(seenLink)
    }
    const unseen = [...links] // convert to array
    const randomPermalink = unseen[Math.floor(Math.random() * unseen.length)]
    const randomPost = get(posts).find(x => x.permalink === randomPermalink)
    const slug = randomPost ? randomPost.slug : ''
    throw redirect(307, `/${randomPermalink}/${slug}`)
}
