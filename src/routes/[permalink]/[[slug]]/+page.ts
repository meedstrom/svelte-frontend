import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts } from '$lib/stores'

export function load({ params }) {

    const post = get(posts).find((post) => post.permalink === params.permalink)

    // const dailies: Post[] = post.tags.includes('daily') ? get(posts).filter(post =>
    //     post.tags.includes('daily')) : null
    // const dailySlugs = dailies.length === 0 ? dailies.map(post => post.slug) : null
    // const prev = dailySlugs ? dailies.find(post =>
    //     dailySlugs.indexOf(post.slug) > dailySlugs.indexOf(data.post.slug)) : null
    // const next = dailySlugs ? dailies.toReversed().find(post =>
    //     dailySlugs.indexOf(post.slug) < dailySlugs.indexOf(data.post.slug)) : null

    if (post) return {
        post: post,
    }
    else {
        // If a known permalink wasn't found, seek among known slugs.
        // Super convenient if I want to type a link manually!
        const otherPost = get(posts).find((post) => post.slug === params.permalink)
        if (otherPost)
            throw redirect(307, `/${otherPost.permalink}/${otherPost.slug}`)
        else
            throw error(404, 'Not found')
    }
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
