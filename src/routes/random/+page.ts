import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { posts, seen } from '$lib/stores'

export function load() {
    // TODO: Maybe it's ok to visit the stubs
    let nonStubLinks = new Set<string>(
        get(posts).filter(x => !x.tags.includes('stub'))
            .map(x => x.permalink)
    )
    // NOTE: set-difference is coming to JS
    // https://github.com/tc39/proposal-set-methods
    for (const link of get(seen)) {
        nonStubLinks.delete(link)
    }
    const unseen = [...nonStubLinks]
    const randomPermalink = unseen[Math.floor(Math.random() * unseen.length)]
    const randomPost = get(posts).find(x => x.permalink === randomPermalink)
    const slug = randomPost ? randomPost.slug : ''
    throw redirect(307, `/${randomPermalink}/${slug}`)
}
