<script lang="ts">
 export let data
 const { subtle } = globalThis.crypto
 import { Buffer } from 'buffer'
 import { goto } from '$app/navigation'
 import { get } from 'svelte/store'
 import { posts, publicPosts,  } from '$lib/stores'
 
 let username = ''
 let pass = ''

 type Post = {
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

 function rewriteAllLinks(posts) {
     posts.forEach((post) => {
         // post.content = post.content.replaceAll(new RegExp("(<a class=\"\" href=\")"), )
     })
 }

 async function myDecrypt( ciphertext: Uint8Array
                         , iv: Uint8Array
                         , postKey: CryptoKey | null) {
     if (!postKey) {
         console.log('postKey undefined')
         return
     }
     let bytes: ArrayBuffer | null = null
     try {
         bytes = await subtle.decrypt({ name: 'AES-GCM', iv }, postKey, ciphertext)
     }
     catch (e) {
         console.log(e)
         alert(e)
     }
     if (!bytes) {
         console.log('Decryption failed')
         return
     }
     const decompressed = await new Response(bytes)
         .body.pipeThrough(new DecompressionStream('gzip'))
     return await new Response(decompressed).text()
 }

 const handleSubmit = async () => {
     // Yes it's a bit... crude... but I trust my friends not to elevate their
     // access level, like they wouldn't peek into a physical diary ;-)
     // Everyone else is missing a key in the first place.
     const perms = {
         'therapist': ['eyes_friend', 'eyes_partner', 'eyes_therapist'],
         'partner':  ['eyes_friend', 'eyes_partner'],
         'friend':  ['eyes_friend'],
     }
     if (!Object.keys(perms).includes(username)) return alert('Unknown user')
     const allowedTags = new Set<string>(perms[username])

     let error
     const maybeKey = pass.trim().slice(1)
     const postKey = await subtle.importKey(
         'raw'
         ,new Uint8Array(Buffer.from(maybeKey, 'base64'))
         ,'AES-GCM'
         ,true
         ,['encrypt', 'decrypt']
     ).catch(x => error = x)
     if (error) {
         console.log(error)
         alert(error)
         return
     }
     const iv = new Uint8Array(data.extraBlob.slice(0, 16))
     const ciphertext = new Uint8Array(data.extraBlob.slice(16))

     const decrypted = await subtle.decrypt({ name: 'AES-GCM', iv }, postKey, ciphertext)
     const decompressed = await new Response(decrypted).body.pipeThrough(new DecompressionStream('gzip'))
     const plaintext = await new Response(decompressed).text()
     const privatePosts: Post[] = JSON.parse(plaintext)

     // const privatePosts: Post[] = await myDecrypt(ciphertext, iv, postKey).then(x => JSON.parse(x))

     // OK, seems rock solid
     // console.log(privatePosts)

     const subset = privatePosts.filter((post: Post) => post.tags.find(tag => allowedTags.has(tag)))
     const newCollection = [...subset, ...get(publicPosts)].sort(
         // order most recently created on top
         (a, b) => b.created.localeCompare(a.created)
     )

     // console.log(newCollection)
     $posts = newCollection

     goto('/all')
 }
</script>
<svelte:head>
    <title>Log in</title>
</svelte:head>

<main>
    <form on:submit|trusted|self|preventDefault={handleSubmit}>
        <label>User
            <input bind:value={username} type="text" />
        </label>

        <label>Passphrase
            <input bind:value={pass} type="password" />
        </label>

        <button type="submit" >Unlock extra posts</button>
    </form>
</main>

<style>
 button {
     padding: 1em;
 }
</style>
