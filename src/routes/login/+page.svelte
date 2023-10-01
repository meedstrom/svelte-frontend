<script lang="ts">
 export let data // has extraBlob
 import { Buffer } from 'buffer'
 import { goto } from '$app/navigation'
 import { get } from 'svelte/store'
 import { posts, publicPosts, rewriteAllLinks } from '$lib/stores'
 import type { Post } from '$lib/stores'
 const { subtle } = globalThis.crypto
 
 let username = ''
 let pass = ''

 const handleSubmit = async () => {
     // Yes it's a bit... crude... but I trust my friends not to elevate their
     // access level, same as they wouldn't peek into a physical diary ;-)
     // Everyone else is missing a key in the first place.
     const perms = {
         'therapist': ['eyes_friend', 'eyes_partner', 'eyes_therapist'],
         'partner':  ['eyes_friend', 'eyes_partner'],
         'friend':  ['eyes_friend'],
     }
     if (!Object.keys(perms).includes(username)) return alert('Unknown user')
     const allowedTags = perms[username]

     const maybeKey = pass.trim().slice(1)
     const postKey = await subtle.importKey(
         'raw'
         ,new Uint8Array(Buffer.from(maybeKey, 'base64'))
         ,'AES-GCM'
         ,true
         ,['encrypt', 'decrypt']
     ).catch(error => alert(error))
     if (!postKey) return

     const iv = new Uint8Array(data.extraBlob.slice(0, 16))
     const ciphertext = new Uint8Array(data.extraBlob.slice(16))

     const decrypted = await subtle.decrypt({ name: 'AES-GCM', iv }, postKey, ciphertext)
                                   .catch(error => console.log(error))
     if (!decrypted) {
         alert('The passphrase did not work (were you given an old one?)')
         return
     }
     const decompressed = await new Response(decrypted).body.pipeThrough(new DecompressionStream('gzip'))
     const plaintext = await new Response(decompressed).text()
     const privatePosts: Post[] = JSON.parse(plaintext)

     const subset = privatePosts.filter((post: Post) =>
         post.tags.find(tag => allowedTags.includes(tag))
     )
     const newCollection = [...subset, ...get(publicPosts)].sort(
         // order most recently created on top
         (a, b) => b.created.localeCompare(a.created)
     )

     $posts = rewriteAllLinks(newCollection, allowedTags)

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
 form {
     margin-left: auto;
     margin-right: 1em;
     /* right: 0; */
     padding: 2em;
     width: 15em;
     /* text-align: left; */
     display: flex;
     flex-direction: column;
 }
 input {
     margin-top: .4em;
     /* margin-left: 1em; */

 }
 button {
     padding: 1em;
     margin-top: 1em;
 }
</style>
