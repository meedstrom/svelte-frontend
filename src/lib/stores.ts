import json from '$lib/posts.json'
import { browser } from '$app/environment'
import { writable } from 'svelte/store'

export type Post = {
     title: string
     slug: string
     permalink: string
     content: string
     wordcount: number
     tags: string[]
     links: number
     created: string
     updated: string
 }


export const privateTags = new Set(
     ["private", "eyes_therapist", "eyes_partner", "eyes_friend"]
)

export function rewriteAllLinks(fnord: Post[]
                                , allowedTags: string[] | undefined) {
     if (!fnord || fnord.length === 0) {
          console.log('posts not defined yet')
          return fnord
     }
     let willUnlink = privateTags
     if (allowedTags) {
          allowedTags.forEach(tag => willUnlink.delete(tag))
     }
     const willUnlinkRegex = [...willUnlink].join('|')
     // would mess it up if my html has nested <a> tags, but it doesn't
     const re = new RegExp(
          '<a +?class="(?:' + willUnlinkRegex + ').*?>(.*?)</a>',
          'gs'
     )
     return fnord.map(post => {
          post.content = post.content.replaceAll(re, '$1')
          return post
     })
}

// Track which pages the visitor has seen, and persist that
// 
// TODO: actually, for the sake of eww/lynx, try first to save it in a
// cookie... then if JS is available, stop trying to use a cookie, because it's slow.
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
