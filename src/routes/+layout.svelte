<script lang="ts">
 import './global.scss'
 import { seen, pubMeta, privMeta } from '$lib/stores'
 import { get } from 'svelte/store'
 let theme = 'auto'
 const colors = [
     "white",
     "tan",
     "pink",
     "dark-red",
     "dark-amber",
     "auto"
 ]
 $: postCount = get(pubMeta).length + $privMeta.length
</script>

<div id="theme-container" class="theme-{theme}">
    <div id="central-column">
        <header>
            <nav>
                <a href="/login">Login</a>
                <a href="/about">About</a>
                <a href="/nexus">Nexus</a>
                <a href="/random">Random</a>
                <!-- Pre-size to eliminate CLS -->
                <a href="/" style="width: 9.25em;">All (seen {$seen.size} of {postCount})</a>
            </nav>
        </header>

        <main>
            <!-- like react Outlet -->
            <slot />
        </main>
    </div>

    <footer>
        <div id="info">
            <p>
                Martin Edström
                <br>
                <a href="https://github.com/meedstrom"> GitHub </a>
            </p>
            <p>All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a>.</p>
            <p><a href="/about">About</a></p>
            <p><a href="/blogroll">"Blogroll"</a></p>
        </div>

        <br>
        <br>
        <div id="theme-picker">
            {#each colors as color}
                <!-- <input type="radio" bind:group={theme} value={color} id={color} name="theme-switch"> -->
                <!-- <label for id={color}>{color}</label> -->

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
     display: flex;
     justify-content: center;
     flex-wrap: wrap-reverse;
     flex-direction: row-reverse;
 }
 </style>
