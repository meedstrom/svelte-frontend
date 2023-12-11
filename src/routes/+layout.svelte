<script lang="ts">
 import './global.scss'
 import { browser } from '$app/environment'
 import { goto } from '$app/navigation'
 import { page } from '$app/stores'
 import { Buffer } from 'buffer'
 import { seen,
          pubMeta,
          privMeta,
          postKey,
          getHardcodedWrappingKey,
          decrypt,
          allowedTags,
          bigIndexRows,
 } from '$lib/stores'
 import { get as stored } from 'svelte/store'

 // TODO: ensure this doesn't download on initial visit
 import extra from '$lib/privPosts.bin'
 import privMetaJSON from '$lib/privMeta.json'
 import { privPosts } from '$lib/postContents'

 $: postCount = stored(pubMeta).size + $privMeta.size

 // On first visit, recover the stored key if any
 const storedPostKey = browser ? window.localStorage.getItem('storedPostKey') : null
 if (storedPostKey && $postKey === '') {
     getHardcodedWrappingKey()
         .then(wrappingKey => crypto.subtle.unwrapKey(
             'raw'
             ,new Uint8Array(Buffer.from(storedPostKey, 'base64'))
             ,wrappingKey
             ,'AES-KW'
             ,'AES-GCM'
             ,false
             ,['encrypt', 'decrypt']
         ))
         .then(x => {
             console.log('postKey set: ' + x)
             $postKey = x
         })
         .then(() => fetch(extra))
         .then((x: Response) => x.arrayBuffer())
         .then(bytes => {
             console.log(bytes)
             console.log(privMetaJSON)
             console.log($postKey)
             console.log(stored(allowedTags))
             return decrypt(bytes, privMetaJSON, $postKey, stored(allowedTags))
         })
         .then(vec => {
             console.log(vec)
             let [posts, meta] = vec
             $privPosts = posts
             $privMeta = meta
             console.log('privPosts loaded, length ' + posts.length)
         })
     .then(() => {
         // same as in login/+page.svelte
         $bigIndexRows = [...stored(pubMeta).values(), ...$privMeta.values()]
             .filter(post => !post.tags.includes('stub'))
             .sort((a, b) => b.created.localeCompare(a.created))
     })
 }

 // TODO: apply background-color to body too, due to elastic scroll revealing
 // white background
 let theme = 'auto'
 const colors = [
     "white",
     "tan",
     "pink",
     "dark-red",
     "dark-amber",
     "auto"
 ]
</script>

<div id="theme-container" class="theme-{theme}">
    <div id="central-column">
        <header>
            <nav>
                <a href="/login">Login</a>
                <a href="/about">About</a>
                <a href="/nexus">Nexus</a>
                <a href="/random">Random</a>
                <!-- Pre-sized to eliminate CLS -->
                <a href="/" style="width: 9.25em;">All (seen {$seen.size} of {postCount})</a>
            </nav>
        </header>
        <main>
            <slot />
        </main>
    </div>
    <footer>
        <div id="info">
            <p>
                Martin Edström
                <br>
                <a href="https://github.com/meedstrom">GitHub</a>
            </p>
            <p>All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a>.</p>
            <p><a href="/about">About</a></p>
            <p><a href="/blogroll">"Blogroll"</a></p>
        </div>
        <div id="theme-picker">
            {#each colors as color}
                <label for={color} class={`theme-${color===theme}`} >{color}
                    <input type="radio" bind:group={theme} value={color} id={color} name="theme-switch">
                </label>
            {/each}
        </div>
    </footer>
</div>

<style>
 #info {
     text-align: center;
 }
 #theme-picker {
     margin-top: 2em;
     display: flex;
     justify-content: center;
     flex-wrap: wrap;
     /* flex-wrap: wrap-reverse; */
     /* flex-direction: row-reverse; */
 }
</style>
