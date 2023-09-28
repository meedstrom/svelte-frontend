import { get } from 'svelte/store'
import { posts } from '$lib/stores'
import { redirect } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

export function load({ params }) {
    const post = get(posts).find((post) => post.slug === params.date)
    if (post) {
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    }
    else throw error(404, 'Not found')
}
