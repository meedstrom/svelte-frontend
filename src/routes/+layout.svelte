<script lang="ts">
 import './global.scss'
 // import github from '$lib/images/github.svg'
 // import aboutIcon from '$lib/images/information-mark-circle-outline-icon.svg'
 import { seen, posts } from '$lib/stores'
</script>

<div id="central-column">
<header>
    <nav>
        <!-- <a href="/about"><img id="about-button" src={aboutIcon} alt="Go to the About-page" width="24px" height="24px"/></a> -->
        <!-- TODO: only show the counter if javascript is active -->
        <!-- <a href="/all">All{#if seen.size != 0} (seen {$seen.size} of {$posts.length}){/if}</a> -->
        <!-- <a id="about-button" href="/about"><img src={aboutIcon} alt="Go to the About page" width="24px" height="24px" /></a> -->
        <a href="/all">All (seen {$seen.size} of {$posts.length})</a>
        <a href="/random">Random</a>
        <a href="/nexus">Nexus</a>
        <a id="about-button" href="/about">About</a>
        <a href="/login">Login</a>
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
        <!-- <a href="https://github.com/meedstrom"><img src={github} alt="GitHub" width="60px" /></a> -->
        <br>
        <a href="https://github.com/meedstrom"> GitHub </a>
    </p>
    <p> All code is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3</a>.</p>
    <p>
        <a href="/about">About</a>
        <br><a href="/blogroll">"Blogroll"</a>
    </p>
</footer>

<style>
 #about-icon {
     @media only screen and (prefers-color-scheme: dark) {
         filter: invert(1);
     }

 }
 #about-button {
     @media only screen and (max-width: 500px) {
         display: none;
     }
 }

</style>
