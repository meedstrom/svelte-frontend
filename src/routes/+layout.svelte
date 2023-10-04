<script lang="ts">
 import './global.scss'
 import { seen, posts } from '$lib/stores'
 let themeName = 'theme-auto'
</script>

<div id="theme-container" class={themeName}>
    <div id="central-column">
        <header>
            <nav>
                <a href="/login">Login</a>
                <a href="/about">About</a>
                <a href="/central-nexus">Nexus</a>
                <a href="/random">Random</a>
                <!-- TODO: only show the counter if javascript is active -->
                <a href="/all">All (seen {$seen.size} of {$posts.length})</a>
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

        <select bind:value={themeName}>
            <option value="theme-light">White</option>
            <option value="theme-sepia">Sepia</option>
            <option value="theme-pink">Pink</option>
            <option value="theme-dark-red">Dark red</option>
            <option value="theme-dark-green">Dark green</option>
            <option value="theme-auto">Auto</option>
        </select>
    </footer>
</div>
