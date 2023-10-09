// TODO: pre-generate postsMetadata in my encrypt10.js.  that way, we don't
// need to generate it here, and that may do the trick for letting the visitor
// avoid downloading the JSON.
import json from '$lib/posts.json'
import { browser } from '$app/environment'
import { writable } from 'svelte/store'

export type Post = {
     slug: string
     permalink: string
     title: string
     created: string
     created_fancy: string
     updated: string
     updated_fancy: string
     wordcount: number
     links: number
     tags: string[]
     hidden: string | null
     content: string
 }

export const privateTags = new Set(
     ["private", "eyes_therapist", "eyes_partner", "eyes_friend"]
)

let initMetadata = JSON.parse(JSON.stringify(json))
// console.log(initMetadata)
initMetadata = initMetadata.map(post => {
     post.content = 'Error, sorry'
     return post
})

// export const slugAssocs = new Map()
export const allowedTags = writable([])
export const publicPosts = writable(json)
export const posts = writable([])
export const postsMetadata = writable(initMetadata)

// Track which pages the visitor has seen, and persist that
//
// TODO: actually, for the sake of eww/lynx, try first to save it in a
// cookie... then if JS is available, stop trying to use a cookie, because it's
// slow.  We will have to allocate around 2-3 cookies, bc cookies max at 4kb
// each so it's really a hack for niche purposes. The alternative is to simply
// set a tracking id and let the server track who has seen what, but...  Or we
// can try to compress the array, but given the random characters it may not be
// so compressible.  Anyway, there's an interesting criterion for how long
// should be the page IDs: sufficiently few characters that ~2000 IDs add up to
// less than 4kB.
//
// In theory, 4-character IDs would lead me to expect around 1
// page ID collision per 1000 pages, manageable.  Then if I encode the array as
// a string sans any quotes signs or commas, and compress or base64-encode it,
// around 1300 IDs should fit comfortably in 1 cookie.
const storedSeen = browser ? window.localStorage.getItem('seen') : null
const initSeen = storedSeen ? new Set<string>(JSON.parse(storedSeen)) : new Set<string>()

export const seen = writable(initSeen)

seen.subscribe(value => {
    if (browser) window.localStorage.setItem('seen', JSON.stringify([...value]))
})
