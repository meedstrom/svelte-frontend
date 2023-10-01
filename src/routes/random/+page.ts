export const prerender = false
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { posts, seen } from '$lib/stores'

export function load() {
    let links = new Set<string>(
        get(posts).map(x => x.permalink)
    )
    // NOTE: set-difference is coming to JS
    // https://github.com/tc39/proposal-set-methods
    for (const link of get(seen)) {
        links.delete(link)
    }
    const unseen = [...links]
    const randomPermalink = unseen[Math.floor(Math.random() * unseen.length)]
    const randomPost = get(posts).find(x => x.permalink === randomPermalink)
    const slug = randomPost ? randomPost.slug : ''
    throw redirect(307, `/${randomPermalink}/${slug}`)
}
