// TODO: Since private posts now go under /unlocked, we have less need for this.
// The main utility left is redirecting from /slug to /id/slug.  So do that.
// Also for performance, cut all these .find(()=>()) in favour of
// pre-constructing an associative array i.e an object
// {'anti-epistemology': 'watWES7', ...}, which you can look up by
// doing array['anti-epistemology'].  That or a Map.

export const prerender = false
import { get } from 'svelte/store'
import { error, redirect } from '@sveltejs/kit'
import { posts, postsMetadata } from '$lib/stores'

export function load({ params }) {
    const post =
        get(posts).find((post) => params.permalink === post.permalink) ??
        get(posts).find((post) => params.permalink === post.slug) ??
        get(posts).find((post) => params.slug === post.slug) ??
        get(postsMetadata).find((post) => params.permalink === post.permalink) ??
        get(postsMetadata).find((post) => params.permalink === post.slug) ??
        get(postsMetadata).find((post) => params.slug === post.slug)
    if (!post)
        throw error(404, 'Not found')
    else if (!post.hidden)
        throw redirect(307, `/${post.permalink}/${post.slug}`)
    else
        return { post }
}
