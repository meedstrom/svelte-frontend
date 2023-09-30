<script lang="ts">
 import './global.scss'
 import github from '$lib/images/github.svg'
 import aboutIcon from '$lib/images/information-mark-circle-outline-icon.svg'
 import { seen, posts } from '$lib/stores'
 import { get } from 'svelte/store'
</script>

<header>
    <nav>
        <!-- <a href="/about"><img id="about-button" src={aboutIcon} alt="Go to the About-page" width="24px" height="24px"/></a> -->
        <!-- TODO: only show the counter if javascript is active -->
        <!-- <a href="/all">All{#if seen.size != 0} (seen {$seen.size} of {$posts.length}){/if}</a> -->
        <a href="/all">All (seen {get(seen).size} of {get(posts).length})</a>
        <a href="/random">Random</a>
        <a href="/nexus">Nexus</a>
        <a href="/about">About</a>
        <a href="/login">Login</a>
    </nav>
</header>

<div id="backdrop">
<main>
    <!-- like react Outlet -->
    <slot />
</main>
</div>

<footer>
    Martin Edström
    <!-- <a href="https://github.com/meedstrom"><img src={github} alt="GitHub" width="60px" /></a> -->
    <br>
    <a href="https://github.com/meedstrom"> GitHub </a>
</footer>

<style>
 /* #about-button {
    @media only screen and (prefers-color-scheme: dark) {
    filter: invert(1);
    }
    }
  */
 </style>
