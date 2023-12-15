// export const prerender = true
// export const prerender = false
export const ssr = false

import extrasPath from '$lib/privPosts.bin'

export async function load({ fetch }) {
    return {
        extraBlob: await fetch(extrasPath).then(
            (res: Response) => res.arrayBuffer()
        )
    }
}
