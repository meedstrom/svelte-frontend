import { browser } from "$app/environment"
import { writable } from "svelte/store"
import { Buffer } from "buffer"
import pubMetaJSON from "$lib/pubMeta.json"
import initRows from "$lib/initRows.json"

export const bigIndexRows = writable(initRows)
export const pubMeta = writable(new Map(Object.entries(pubMetaJSON)))
export const privMeta = writable(new Map())
export const privateTags = new Set([
     "fren",
     "gri",
     "lover",
     "privy",
     "shrink",
     "noexport",
     "private",
     "censor",
     "archive",
])

// function filterSeen(seen: Set<string>) {
//      seen.delete
// }

// Which pages the visitor has seen
// TODO: the counter in the nav bar should only count the ids currently known, altho there's no need to clean out invalids from the store
export const seen = writable(
     new Set(browser ? JSON.parse(window.localStorage.getItem("seen")) : null)
)

// Which unlocked posts this visitor is privy to
export const allowedTags = writable(
     browser ? JSON.parse(window.localStorage.getItem("allowedTags")) ?? [] : []
)

// Key for unlocking private posts
export const storedPostKey = writable(
     browser ? window.localStorage.getItem("storedPostKey") : ""
)

// Sync above Svelte stores to LocalStorage
seen.subscribe((value: Set<string>) => {
     if (browser)
          window.localStorage.setItem("seen", JSON.stringify([...value]))
})
allowedTags.subscribe((value) => {
     if (browser)
          window.localStorage.setItem("allowedTags", JSON.stringify(value))
})
storedPostKey.subscribe((value: string) => {
     if (browser) window.localStorage.setItem("storedPostKey", value)
})

export const getHardcodedWrappingKey = async () => {
     return await crypto.subtle.importKey(
          "raw",
          // NOTE: Yes it's plaintext.  Can't be secret from who reads the
          // code, but the wrapping key is not the encryption key anyway.
          new Uint8Array([
               30, 225, 107, 217, 205, 158, 108, 110, 187, 158, 194, 55, 203,
               81, 30, 84, 109, 198, 83, 29, 23, 130, 131, 28, 110, 122, 228,
               24, 11, 97, 140, 7,
          ]),
          "AES-KW",
          false,
          ["wrapKey", "unwrapKey"]
     )
}

export const decryptExtras = async (
     bytes: ArrayBuffer,
     fullPrivMeta: Post[],
     storedKey: string,
     allowedTags: string[]
) => {
     const iv = new Uint8Array(bytes.slice(0, 16))
     const ciphertext = new Uint8Array(bytes.slice(16))
     const postKey = await crypto.subtle.unwrapKey(
          "raw",
          new Uint8Array(Buffer.from(storedKey, "base64")),
          await getHardcodedWrappingKey(),
          "AES-KW",
          "AES-GCM",
          false,
          ["encrypt", "decrypt"]
     )

     const decryptedBytes = await crypto.subtle
          .decrypt({ name: "AES-GCM", iv: iv }, postKey, ciphertext)
          .catch((error) => console.log(error))
     if (!decryptedBytes) return alert("Passphrase did not work (old?)")

     const inflated = await new Response(decryptedBytes).body.pipeThrough(
          new DecompressionStream("gzip")
     )
     const plaintext = await new Response(inflated).text()

     let privPosts = new Map(Object.entries(JSON.parse(plaintext)))
     let privMeta = new Map(Object.entries(fullPrivMeta))
     privMeta.forEach((post, id, _map) => {
          if (!post.tags.find((tag) => allowedTags.includes(tag))) {
               // map.delete(id)
               privMeta.delete(id)
               privPosts.delete(id)
          }
     })

     return [privPosts, privMeta]
}
