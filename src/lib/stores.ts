import json from '$lib/posts.json'
import { browser } from '$app/environment'
import { writable } from 'svelte/store'

// does not get exported, why?
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

const storedSeen = browser ? window.localStorage.getItem('seen') : null
const initSeen = storedSeen ? new Set<string>(JSON.parse(storedSeen)) : new Set<string>()

export const seen: string[] = writable(initSeen)

seen.subscribe(value => {
    if (browser) window.localStorage.setItem('seen', JSON.stringify([...value]))
})

// Needs to be a store bc afaik, I can't access a prop from within the loader in
// /[permalink]/+page.ts, props are available only to a .svelte file.
export const publicPosts: Post[] = writable(json) // never change this
export const posts: Post[] = writable(json)
