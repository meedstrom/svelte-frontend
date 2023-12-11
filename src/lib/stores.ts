import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import pubMetaJSON from '$lib/pubMeta.json'
import initRows from '$lib/initRows.json'

// DEPRECATED
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
     description: string | null
 }

export const bigIndexRows = writable(initRows)
export const pubMeta = writable(new Map(Object.entries(pubMetaJSON)))
export const privMeta = writable(new Map())
export const privateTags = new Set(
     ["private", "eyes_therapist", "eyes_partner", "eyes_friend"]
)

// Track which pages the visitor has seen
// TODO: is there a neater way to express this? Bloody Javascript.
const storedSeen = browser ? window.localStorage.getItem('seen') : null
const initialSeen = storedSeen ? new Set<string>(JSON.parse(storedSeen)) : new Set<string>()
export const seen = writable(initialSeen)
// Keep persisting to localStorage
seen.subscribe(value => {
     if (browser) {
          window.localStorage.setItem('seen', JSON.stringify([...value]))
     }
})

// is there a neater way to express this?
const stored2 = browser ? window.localStorage.getItem('allowedTags') : null
const initial2 = stored2 ? JSON.parse(stored2) : []
export const allowedTags = writable(initial2)
allowedTags.subscribe(value => {
     if (browser) {
          window.localStorage.setItem('allowedTags', JSON.stringify(value))
     }
})

// Locally stored crypto key
export const postKey = writable('')
export const getHardcodedWrappingKey = async () => {
     return await crypto.subtle.importKey(
          'raw'
          // NOTE: Yes it's plaintext.  Needs not be secret from who reads the
          // code; the wrapping key is not the encryption key.
          ,new Uint8Array([30,225,107,217,205,158,108,110,187,158,194,55,203,81,30,84,109,198,83,29,23,130,131,28,110,122,228,24,11,97,140,7])
          ,'AES-KW'
          ,false
          ,['wrapKey', 'unwrapKey']
     )
}

export const decrypt = async (blob, origPrivMeta, key, allowedTags) => {
     const iv = new Uint8Array(blob.slice(0, 16))
     const ciphertext = new Uint8Array(blob.slice(16))

     const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv }, key, ciphertext
     ).catch(error => console.log(error))

     if (!decrypted) return alert('Passphrase did not work (old?)')

     const decompressed = await new Response(decrypted)
          .body.pipeThrough(new DecompressionStream('gzip'))
     const plaintext = await new Response(decompressed).text()

     let privPosts = new Map(Object.entries(JSON.parse(plaintext)))
     let privMeta = new Map(Object.entries(origPrivMeta))
     privMeta.forEach((post, id, map) => {
          if (!post.tags.find(tag => allowedTags.includes(tag))) {
               map.delete(id)
               privPosts.delete(id)
          }
     })

     return [privPosts, privMeta]
}
