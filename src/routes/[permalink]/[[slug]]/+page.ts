import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {
    const post = get(posts).find((post) => post.permalink === params.permalink)
    if (post) return {
        post: post
    }
    else throw error(404, 'Not found')
}

// Maybe redirect for private posts that can't be prerendered -- but I want to use the same page.svelte, so what gives?

// export function load({ params, url }) {
//     const post = get(posts).find((post) => post.permalink === params.permalink)
//     if (post) {
//         if (post.tags.find(tag => privateTags.has(tag))) {
//             throw redirect(307, `/private/${url}`)
//         }
//         else return {
//             post: post
//         }
//     }

//     else throw error(404, 'Not found')
// }
