<script lang="ts">
 import './global.scss'
 import { seen, posts } from '$lib/stores'
</script>

<div id="central-column">
    <header>
        <nav>
            <!-- TODO: only show the counter if javascript is active -->
            <a href="/about">About</a>
            <a href="/nexus">Nexus</a>
            <a href="/random">Random</a>
            <a href="/all">All (seen {$seen.size} of {$posts.length})</a>
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
        <br>
        <a href="https://github.com/meedstrom"> GitHub </a>
    </p>
    <p> All code licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GNU GPLv3</a>.</p>
    <p>
        <a href="/about">About</a>
        <br><a href="/blogroll">"Blogroll"</a>
    </p>
</footer>
