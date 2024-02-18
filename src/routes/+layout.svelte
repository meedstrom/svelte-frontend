<script lang="ts">
 import './global.scss'
 import { browser } from '$app/environment'
 import { invalidateAll } from '$app/navigation'
 // import { page } from '$app/stores'
 import { Buffer } from 'buffer'
 import { seen,
          pubMeta,
          privMeta,
          storedPostKey,
          decryptExtras,
          allowedTags,
          bigIndexRows,
 } from '$lib/stores'
 import { get as stored } from 'svelte/store'

 // TODO: ensure this doesn't download on initial visit
 import extrasPath from '$lib/privPosts.bin'
 import privMetaJSON from '$lib/privMeta.json'
 import { privPosts } from '$lib/postContents'

 $: postCount = stored(pubMeta).size + $privMeta.size

 // On first visit, decrypt extra posts if visitor has a stored key
 // TODO: put in afterNavigate, onMount or some such
 if ($storedPostKey !== '' && $privPosts.size === 0) {
     console.log('fetching')
     fetch(extrasPath)
            .then((response) => response.arrayBuffer())
            .then((bytes) => decryptExtras(
                bytes, privMetaJSON, $storedPostKey, $allowedTags
            ))
            .then((decryptedExtras: Array) => {
                const [posts, meta] = decryptedExtras
                $privPosts = posts
                $privMeta = meta
                // same as in login/+page.svelte
                // TODO: maybe this can happen automatically in the def for
                //       bigIndexRows? Or a subscription to privMeta can
                //       update bigIndexRows.
                $bigIndexRows =
                    [...stored(pubMeta).values(), ...$privMeta.values()]
                        .filter(post => !post.tags.includes('stub'))
                        .filter(post => !post.tags.includes('tag'))
                        .sort((a, b) => b.created.localeCompare(a.created))
                // force reload in case someone cold-visits a priv link
                // (an '/unlocked/...' path)
                invalidateAll()
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
                <a href="/nexus">Explore</a>
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
                <a rel="me" href="https://github.com/meedstrom">GitHub</a>
                <br>
                <a rel="me" href="https://emacs.ch/@meedstrom">Mastodon</a>
            </p>
            <p>All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a>.</p>
            <p><a href="/about">About</a></p>
            <p><a href="/blogroll">"Blogroll"</a></p>
        </div>
        <div id="theme-picker">
            {#each colors as color}
                <label for={color} class={`theme-${color === theme}`} >{color}
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
