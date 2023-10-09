<script lang="ts">
 export let data // has extraBlob
 // TODO: to avoid sveltekit's data preloading (which usually we like), load it
 // here instead of in +page.ts.
 // import extra from '$lib/privPosts.bin'
 import { Buffer } from 'buffer'
 import { goto } from '$app/navigation'
 import { privMeta, pubMeta, allowedTags, sitemapRows } from '$lib/stores'
 import { get } from 'svelte/store'
 import { privPosts } from '$lib/postContents'
 import origPrivMeta from '$lib/privMeta.json'
 
 let username = ''
 let pass = ''

 // Yes it's a bit... crude... but I trust my friends not to elevate their
 // access level, same as they wouldn't peek into a physical diary ;-)
 // Everyone else is missing a key in the first place.
 const perms = {
     'therapist': ['eyes_friend', 'eyes_partner', 'eyes_therapist'],
     'partner':  ['eyes_friend', 'eyes_partner'],
     'friend':  ['eyes_friend'],
 }

 const handleSubmit = async () => {
     if (!Object.keys(perms).includes(username)) return alert('Unknown user')
     $allowedTags = perms[username]

     const maybeKey = pass.trim().slice(1)
     const postKey = await crypto.subtle.importKey(
         'raw'
         ,new Uint8Array(Buffer.from(maybeKey, 'base64'))
         ,'AES-GCM'
         ,true
         ,['encrypt', 'decrypt']
     ).catch(error => alert(error))
     if (!postKey) return

     const iv = new Uint8Array(data.extraBlob.slice(0, 16))
     const ciphertext = new Uint8Array(data.extraBlob.slice(16))

     const decrypted = await crypto.subtle.decrypt(
         { name: 'AES-GCM', iv }, postKey, ciphertext
     ).catch(error => console.log(error))
     if (!decrypted) return alert('Passphrase did not work (old?)')

     const decompressed = await new Response(decrypted)
         .body.pipeThrough(new DecompressionStream('gzip'))
     const plaintext = await new Response(decompressed).text()
     let unlocked = new Map(Object.entries(JSON.parse(plaintext)))

     $privMeta = origPrivMeta.filter(post => post.tags.find(
         tag => $allowedTags.includes(tag)
     ))

     unlocked.forEach((_, id, map) => {
         if (!$privMeta.find(post => post.permalink === id))
             map.delete(id)
     })

     $privPosts = unlocked
     // $privMeta = origPrivMeta.filter(post => unlocked.has(post.permalink))

     // order most recently created on top
     $sitemapRows = [...get(pubMeta), ...$privMeta]
         .filter(post => !post.tags.includes('stub'))
         .sort((a, b) => b.created.localeCompare(a.created))

     goto('/')
 }
</script>
<svelte:head>
    <title>Log in</title>
    <meta name="description" content="Log-in page">
</svelte:head>

    <form on:submit|trusted|self|preventDefault={handleSubmit}>
        <label>User
            <input bind:value={username} type="text" autofocus />
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
