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

export function rewriteAllLinks(givenPosts: Post[]
                                , allowedTags: string[] | undefined) {
     if (!givenPosts || givenPosts.length === 0) return
     let willUnlink = new Set([...privateTags])
     // JS doesn't have set-difference methods yet, it's coming
     if (allowedTags) allowedTags.forEach(tag => willUnlink.delete(tag))
     const willUnlinkRegex = [...willUnlink].join('|')
     // My html has no nested <a> tags, so this regex is satisfactory
     const re = new RegExp(
          '<a +?class="[^\"]*?(?:' + willUnlinkRegex + ').*?>(.*?)</a>',
          'gs'
     )
     return givenPosts.map(post => {
          post.content = post.content.replaceAll(re, '$1')
          return post
     })
}

// Track which pages the visitor has seen, and persist that
// 
// TODO: actually, for the sake of eww/lynx, try first to save it in a
// cookie... then if JS is available, stop trying to use a cookie, because it's
// slow.  We will have to allocate around 2-3 cookies, bc cookies max at 4kb
// each so it's really a hack for niche purposes. The alternative is to simply
// set a tracking id and let the server track who has seen what, but...  Or we
// can try to compress the array, but given the random characters it may not be
// so compressible.  Anyway, there's an interesting criterion for how long
// should be the page IDs: sufficiently few characters that ~1000 IDs add up
// to less than 4kB.
const storedSeen = browser ? window.localStorage.getItem('seen') : null
const initSeen = storedSeen ? new Set<string>(JSON.parse(storedSeen)) : new Set<string>()

export const seen: string[] = writable(initSeen)

seen.subscribe(value => {
    if (browser) window.localStorage.setItem('seen', JSON.stringify([...value]))
})

// Even the posts need to be a store bc afaik, I can't access a prop from within
// load() in +page.ts, props are available only to a .svelte file.
export const publicPosts: Post[] = writable(json) // TODO: make it read-only
export const posts: Post[] = writable(rewriteAllLinks(json))
