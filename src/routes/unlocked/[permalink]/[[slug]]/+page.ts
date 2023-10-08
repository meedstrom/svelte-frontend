export const prerender = false
export const ssr = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts, postsMetadata } from '$lib/stores'

export function load({ params }) {
    // User is logged in
    if (get(posts).length > 0) {
        const post =
            get(posts).find((post) => params.permalink === post.permalink) ??
            get(posts).find((post) => params.permalink === post.slug) ??
            get(posts).find((post) => params.slug === post.slug)
        if (post) {
            // console.log('post found')
            // console.log(post)
            return { post }
        }
        else throw error(404, 'Not found')
    }
    // User is not logged in
    else {
        const post =
            get(postsMetadata).find((post) => params.permalink === post.permalink) ??
            get(postsMetadata).find((post) => params.permalink === post.slug) ??
            get(postsMetadata).find((post) => params.slug === post.slug)
        if (post) throw redirect(307, `/${post.permalink}/${post.slug}`)
        else throw error(404, 'Not found')
    }
}
