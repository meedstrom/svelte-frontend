<script lang="ts">
 import './global.scss'
 import { seen, posts } from '$lib/stores'
 import { onMount } from 'svelte'
 let theme
 $: theme && console.log(theme)
</script>


<div id="reversed-container">

        <input type="radio" bind:group={theme} value="off-white" name="theme-switch" class="theme-switch" id="theme-off-white">
        <label for="theme-off-white">Off-white</label>
        <input type="radio" bind:group={theme} value="sepia" name="theme-switch" class="theme-switch" id="theme-sepia">
        <label for="theme-sepia">Sepia</label>
        <input type="radio" bind:group={theme} value="pink" name="theme-switch" class="theme-switch" id="theme-pink">
        <label for="theme-pink">Pink</label>
        <input type="radio" bind:group={theme} value="dark-red" name="theme-switch" class="theme-switch" id="theme-dark-red">
        <label for="theme-dark-green">Dark green</label>
        <input type="radio" bind:group={theme} value="dark-green" name="theme-switch" class="theme-switch" id="theme-dark-green">
        <label for="theme-dark-amber">Dark amber</label>
        <input type="radio" bind:group={theme} value="dark-amber" name="theme-switch" class="theme-switch" id="theme-dark-amber">
        <label for="theme-dark-red">Dark red</label>
        <input type="radio" bind:group={theme} value="auto" name="theme-switch" class="theme-switch" id="theme-auto">
        <label for="theme-auto">Auto</label>
    
    <div id="theme-container">
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

        <footer>
            <p>
                Martin Edström
                <br>
                <a href="https://github.com/meedstrom"> GitHub </a>
            </p>
            <p> All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3+</a>.</p>
            <p>
                <a href="/about">About</a>
                <br><a href="/blogroll">"Blogroll"</a>
            </p>
        </footer>
    </div>
</div>
<style>
 #reversed-container {
     display: flex;
     flex-direction: column-reverse;
 }

 /* #reversed-container > input,
    #reversed-container > label {
    flex-wrap: wrap;
    } */
</style>
