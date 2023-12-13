<script lang="ts">
 export let data // data.extraBlob will set privPosts
 // TODO: to avoid sveltekit's data preloading (which usually we like), load it
 // here instead of in +page.ts.
 // import extra from '$lib/privPosts.bin'
 import { Buffer } from 'buffer'
 import { goto } from '$app/navigation'
 import { get as stored } from 'svelte/store'
 import {
     privMeta,
     pubMeta,
     allowedTags,
     bigIndexRows,
     getHardcodedWrappingKey,
     storedPostKey,
     decryptExtras,
 } from '$lib/stores'
 import { privPosts } from '$lib/postContents'
 import privMetaJSON from '$lib/privMeta.json'

 let pass = ''

 // Yes it's a bit... crude... but I trust my friends not to elevate their
 // access level, same as they wouldn't peek into a physical diary ;-)
 // Everyone else is missing a key in the first place.
 const perms = {
     't': ['eyes_friend', 'eyes_partner', 'eyes_therapist'],
     'p': ['eyes_friend', 'eyes_partner'],
     'f': ['eyes_friend'],
 }

 const handleSubmit = async () => {
     const userCategory = pass.trim().slice(0, 1)
     if (!Object.keys(perms).includes(userCategory)) return alert('Unknown user')
     $allowedTags = perms[userCategory]

     const maybeKey = await crypto.subtle.importKey(
         'raw'
         ,new Uint8Array(Buffer.from(pass.trim().slice(1), 'base64'))
         ,'AES-GCM'
         ,true
         ,['encrypt', 'decrypt']
     ).catch((error) => alert(error))
     if (!maybeKey) return

     // Persist it locally for future site visits
     const wrappedKey = await crypto.subtle.wrapKey(
         'raw'
         ,maybeKey
         ,await getHardcodedWrappingKey()
         ,'AES-KW'
     )
     $storedPostKey = Buffer.from(wrappedKey).toString('base64')

     // const extraBlob = await fetch(extra).then((x: Response) => x.arrayBuffer())


     //      // const iv = new Uint8Array(data.extraBlob.slice(0, 16))
     //      // const ciphertext = new Uint8Array(data.extraBlob.slice(16))
     //      //
     //      // const decrypted = await crypto.subtle.decrypt(
     //      //     { name: 'AES-GCM', iv }, $storedPostKey, ciphertext
     //      // ).catch(error => console.log(error))
     //      // if (!decrypted) return alert('Passphrase did not work (old?)')
     //      //
     //      // const decompressed = await new Response(decrypted)
     //      //     .body.pipeThrough(new DecompressionStream('gzip'))
     //      // const plaintext = await new Response(decompressed).text()
     //      //
     //      // let privPosts = new Map(Object.entries(JSON.parse(plaintext)))
     //      // let privMeta = new Map(Object.entries(privMetaJSON))
     //      // privMeta.forEach((post, id, map) => {
     //      //     if (!post.tags.find(tag => stored(allowedTags).includes(tag))) {
     //      //         map.delete(id)
     //      //         privPosts.delete(id)
     //      //     }
     //      // })

     // replacement of the above
     const [privPosts, privMeta] = await decryptExtras(
         data.extraBlob, privMetaJSON, $storedPostKey, $allowedTags
     )

     $privPosts = privPosts
     $privMeta = privMeta

     console.log(`Unlocked ${$privPosts.size} posts`)

     // Order by most-recently created on top.  This is not just for the table,
     // which can sort itself anyway, but it helps finding the next and
     // previous page in a series, such as the series of daily-pages.
     $bigIndexRows = [...stored(pubMeta).values(), ...$privMeta.values()]
         .filter((post) => !post.tags.includes('stub'))
         .sort((a, b) => b.created.localeCompare(a.created))

     goto('/')
 }
</script>
<svelte:head>
    <title>Log in</title>
    <meta name="description" content="Log-in page">
</svelte:head>

<form on:submit|trusted|self|preventDefault={handleSubmit}>
    <!-- Username actually does nothing, but included for UX -->
    <label>User
        <!-- svelte-ignore a11y-autofocus -->
        <input type="text" autofocus />
    </label>

    <label>Passphrase
        <input bind:value={pass} type="password" />
    </label>

    <button type="submit">Unlock extra posts</button>
</form>

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
