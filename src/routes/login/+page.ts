// export const prerender = true
// export const prerender = false
export const ssr = false

import extra from '$lib/privPosts.bin'

export async function load({ fetch }) {
    return {
        extraBlob: await fetch(extra).then((x: Response) => x.arrayBuffer())
    }
}
