<script lang="ts">
 import './global.scss'
 import 'iconify-icon'
 import IconGithub from 'virtual:icons/mdi/github'
 import IconMastodon from 'virtual:icons/mdi/mastodon'
 import IconRSS from 'virtual:icons/mdi/rss'
 import IconKey from 'virtual:icons/mdi/key'
 import IconEmail from 'virtual:icons/mdi/email'
 import { browser } from '$app/environment'
 import { assets } from '$app/paths'
 // import '/pubkey-meedstrom.gpg'
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
     // console.log('fetching')
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
     // "pink",
     "dark-red",
     "dark-amber",
     "auto"
 ]
</script>

<div id="theme-container" class="theme-{theme}">
    <div id="central-column">
        <header>
            <nav>
                <a href="/">Recent</a>
                <!-- Pre-sized to eliminate CLS -->
                <a href="/all" style="width: 9.25em;">All (seen {$seen.size} of {postCount})</a>
                <a href="/random">Random</a>
                <a href="/portals">Portals</a>
                <a href="/about">About</a>
                {#if $allowedTags.length === 0}
                    <a href="/login">Login</a>
                {:else}
                    <a href="/logout">Logout</a>
                {/if}
            </nav>
        </header>
        <main>
            <slot />
        </main>
    </div>
    <footer>
        <div id="info">
            <div class="h-card p-author">
                <p><a rel="me" class="p-name u-uid u-url undecorated-link" href="https://edstrom.dev">Martin Edström</a></p>
                <div class="row">
                    <!-- <div><iconify-icon icon="mdi:github"></iconify-icon></div> -->
                    <div class="icon"><IconGithub /></div>
                    <div><a rel="me" href="https://github.com/meedstrom">GitHub</a></div>
                </div>
                <div class="row">
                    <!-- <div><iconify-icon icon="mdi:mastodon"></iconify-icon></div> -->
                    <div class="icon"><IconMastodon /></div>
                    <div><a rel="me" href="https://emacs.ch/@meedstrom">Mastodon</a></div>
                </div>
                <div class="row">
                    <!-- <div><iconify-icon icon="mdi:rss"></iconify-icon></div> -->
                    <div class="icon"><IconRSS /></div>
                    <!-- <div><a target="_self" type="application/atom+xml" href="{assets}/posts.atom">Feed</a></div> -->
                    <div><a target="_self" type="application/atom+xml" href="/posts.atom">Feed</a></div>
                </div>
                <div class="row">
                    <!-- <div><iconify-icon icon="mdi:key"></iconify-icon></div> -->
                    <div class="icon"><IconKey /></div>
                    <div><a rel="gpgkey" target="_self" type="application/pgp-keys" href="/pubkey-meedstrom.gpg">OpenPGP</a></div>
                </div>
                <div class="row">
                    <!-- <div><iconify-icon icon="mdi:email"></iconify-icon></div> -->
                    <div class="icon"><IconEmail /></div>
                    <div><a rel="me" href="mailto:jg7prz0oa@mozmail.com">Email</a></div>
                </div>
            </div>
            <!-- <p>All code snippets licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a></p> -->
            <!-- <p><a href="/about">About</a></p> -->
            <!-- <p><a href="/blogroll">"Blogroll"</a></p> -->
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
 #info .row {
     /* display: flex; */
     justify-content: unset;
 }
 .row > div {
     width: 50%;
 }
 .row > div:nth-child(1) {
     width: 40%;
 }
 .row > div:nth-child(2) {
     text-align: left;
 }
 .h-card {
     width: 10em;
     margin-left: auto;
     margin-right: auto;
 }

 #info .icon {
     font-size: 20px;
     /* font-size: 26px; */
 }

 #theme-picker {
     margin-top: 2em;
     display: flex;
     justify-content: center;
     flex-wrap: wrap;
 }
</style>
