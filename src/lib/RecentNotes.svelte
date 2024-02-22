<script lang="ts">
 export let data
 import { get as stored } from 'svelte/store'
 import { pubMeta, privMeta } from '$lib/stores'
 import { pubPosts, privPosts } from '$lib/postContents'
 import Note from '$lib/Note.svelte'
 import type { Post, NoteData } from '$lib/types'

 let orderedByCreation = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.find((tag) => ['daily', 'stub', 'tag'].includes(tag)))
     .sort((a, b) => (b.updated ?? b.created).localeCompare((a.updated ?? a.created)))

 $: offset = data.params.offset ? Number(data.params.offset) : 0
 $: notesToShow = orderedByCreation
     .slice(0 + offset, 4 + offset)
     .map((meta) => new Object({
         post: meta,
         content: $pubPosts.get(meta.permalink),
         id: meta.permalink,
     }))
</script>

<!-- TODO: Cut the central column into sections -->
<!-- TODO: Attach the pagination as metadata on the
     URL, so visitor can use back-button -->

<div class="paginator">
    {#if (offset >= 4) }
        <!-- <button on:click={newer}>Newer</button> -->
        <a href={`/recent/${offset - 4}`}>Newer</a>
    {:else}
        Newer
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset <= orderedByCreation.length - 4)}
        <a href={`/recent/${offset + 4}`}>Older</a>
    {:else}
        Older
    {/if}
</div>

{#each notesToShow as data}
    <Note data={data} />
{/each}

<div class="paginator">
    {#if (offset >= 4) }
        <!-- <button on:click={newer}>Newer</button> -->
        <a href={`/recent/${offset - 4}`}>Newer</a>
    {:else}
        Newer
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset <= orderedByCreation.length - 4)}
        <a href={`/recent/${offset + 4}`}>Older</a>
    {:else}
        Older
    {/if}
</div>

<style>
 button:disabled {
     background: grey;
     border-color: grey;
 }
 div.paginator button:first-child {
     /* margin-left: 50%; */
 }
 div.paginator button:last-child {
     /* margin-right: 50%; */
 }
</style>
