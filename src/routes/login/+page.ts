import extra from '$lib/extraPosts.bin'

export async function load({ fetch }) {
    return {
        extraBlob: await fetch(extra).then((x: Response) => x.arrayBuffer())
    }
}
