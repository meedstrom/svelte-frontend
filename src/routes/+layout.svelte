<script lang="ts">
 import './global.scss'
 import github from '$lib/images/github.svg'
 import aboutIcon from '$lib/information-mark-circle-outline-icon.svg'
 import { seen, posts } from '$lib/stores'
</script>

<nav>
    <a href="/about"><img id="about-button" src={aboutIcon} alt="Go to the About-page" width="24px" height="24px"/></a>
    <!-- TODO: only show the counter if javascript is active -->
    <a href="/all">All (seen {$seen.size} of {$posts.length})</a>
    <a href="/random">Random</a>
    <a href="/login">Login</a>
</nav>

<!-- like react Outlet -->
<slot posts={$posts} />

<footer>
    Martin Edström
    <!-- <a href="https://github.com/meedstrom"><img src={github} alt="GitHub" width="60px" /></a> -->
    <br>
    <a href="https://github.com/meedstrom"> GitHub </a>
</footer>

<style>
 #about-button {
     @media only screen and (prefers-color-scheme: dark) {
         filter: invert(1);
     }
 }

 nav {
     height: 6em;
     width: 100%;
 }
 nav a {
     font-size: 1.2em;
     padding: 1em;
     display: inline-block;
     text-align: center;
     vertical-align: middle;
 }
 footer {
     text-align: center;
     padding: 2em;
 }
 </style>
