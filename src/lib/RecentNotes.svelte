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
        <span>Newer</span>
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset <= orderedByCreation.length - 4)}
        <a href={`/recent/${offset + 4}`}>Older</a>
    {:else}
        <span>Older</span>
    {/if}
</div>

{#each notesToShow as data}
    <Note data={data} />
{/each}

<div class="paginator" id="paginator2">
    {#if (offset >= 4) }
        <!-- <button on:click={newer}>Newer</button> -->
        <a href={`/recent/${offset - 4}`}>Newer</a>
    {:else}
        <span>Newer</span>
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset <= orderedByCreation.length - 4)}
        <a href={`/recent/${offset + 4}`}>Older</a>
    {:else}
        <span>Older</span>
    {/if}
</div>

<style>
 /*
    button:disabled {
    background: grey;
    border-color: grey;
    }
  */
 div.paginator {
     /* margin-left: auto; */
     margin-left: auto;
     margin-right: auto;
     width: fit-content;
     background-color: var(--bg);
     padding: .5em;
     margin-bottom: .5em;
 }

 div.paginator > a,
 div.paginator > span {
     padding: .5em;
 }
 #paginator2 {
     margin-top: -2em;
 }

</style>
