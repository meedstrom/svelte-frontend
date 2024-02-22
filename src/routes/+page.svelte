<script lang="ts">
 import { get as stored } from 'svelte/store'
 import { page } from '$app/stores'
 import { pushState, goto } from '$app/navigation'
 import { pubMeta, privMeta } from '$lib/stores'
 import { pubPosts, privPosts } from '$lib/postContents'
 import Note from '$lib/Note.svelte'
 import type { Post, NoteData } from '$lib/types'

 let orderedByCreation = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.find((tag) => ['daily', 'stub', 'tag'].includes(tag)))
     .sort((a, b) => (b.updated ?? b.created).localeCompare((a.updated ?? a.created)))
 // let skip = $page.url.searchParams.get('skip') ?? 0
 let skip = $page.url.searchParams.get('skip') ?? 0
 // $: skip = 0
 // if ($page.state && $page.state.skip) {
 //     skip = $page.state.skip
 // }
 $: notesToShow = orderedByCreation
     .slice(0 + skip, 4 + skip)
     .map((meta) => new Object({
         post: meta,
         content: $pubPosts.get(meta.permalink),
         id: meta.permalink,
     }))

 const older = () => {
     skip += 4
     goto(`?skip=${skip}`)
 }
 const newer = () => {
     skip -= 4
     goto(`?skip=${skip}`)
 }

</script>

<svelte:head>
    <title>Recent pages</title>
</svelte:head>

<!-- TODO: Cut the central column into sections -->
<!-- TODO: Attach the pagination as metadata on the
     URL, so visitor can use back-button -->

<div class="paginator">
    {#if (skip >= 4) }
        <button on:click={newer}>Newer</button>
    {:else}
        <button disabled>Newer</button>
    {/if}
    Showing {skip + 1} to {skip + 4}
    {#if (skip <= orderedByCreation.length - 4)}
        <button on:click={older}>Older</button>
    {:else}
        <button disabled>Older</button>
    {/if}
</div>

{#each notesToShow as data}
    <Note data={data} />
{/each}

<div class="paginator">
    {#if skip >= 4 }
        <button on:click={newer}>Newer</button>
    {:else}
        <button disabled>Newer</button>
    {/if}
    Showing {skip + 1} to {skip + 4}
    {#if skip <= orderedByCreation.length - 4}
        <button on:click={older}>Older</button>
    {:else}
        <button disabled>Older</button>
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
