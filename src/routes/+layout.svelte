<script lang="ts">
 import './global.scss'
 import { seen, posts } from '$lib/stores'
 import { onMount } from 'svelte'
 let theme = 'auto'
 const colors = [
     /* "white", */
     "off-white",
     "sepia",
     "pink",
     "dark-red",
     "dark-green",
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
                    <!-- TODO: only show the counter if javascript is active -->
                    <a href="/">All (seen {$seen.size} of {$posts.length})</a>
                </nav>
            </header>

            <main>
                <!-- like react Outlet -->
                <slot />
            </main>
        </div>

        <footer class="row">

            <div id="info">
                <p>
                    Martin Edström
                    <br>
                    <a href="https://github.com/meedstrom"> GitHub </a>
                </p>
                <p>All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a>.</p>
                <p>
                    <a href="/about">About</a>
                    <br><a href="/blogroll">"Blogroll"</a>
                </p>
            </div>

            <div class="align-right">
                {#each colors as color}
                    <!-- <input type="radio" bind:group={theme} value={color} id={color} name="theme-switch"> -->
                    <!-- <label for id={color}>{color}</label> -->

                    <label for={color}>{color}
                        <input type="radio" bind:group={theme} value={color} id={color} name="theme-switch">
                    </label>
                {/each}
            </div>
        </footer>
</div>

<style>

 div#info {
     text-align: center;
     margin-right: 1em;
 }
 div.align-right {
     white-space: nowrap;
     text-align: right;
 }
</style>
