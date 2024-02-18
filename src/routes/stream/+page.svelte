<script lang="ts">
 import { get as stored } from 'svelte/store'
 import { pubMeta, privMeta } from '$lib/stores'
 import { pubPosts, privPosts } from '$lib/postContents'
 import Note from '$lib/Note.svelte'
 import type { Post } from '$lib/stores'
 type NoteData = {
     post: Post,
     content: string,
     id: string,
 }

 let orderedByCreation = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.find((tag) => ['daily', 'stub', 'tag'].includes(tag)))
     .sort((a, b) => b.created.localeCompare(a.created))
 let skip = 0
 $: notesToShow = orderedByCreation
     .slice(0 + skip, 4 + skip)
     .map((meta) => new Object({
         post: meta,
         content: $pubPosts.get(meta.permalink),
         id: meta.permalink,
     }))
</script>

{#each notesToShow as data}
    <Note data={data} />
{/each}

{#if (skip >= 4) }
    <button on:click={() => skip += -4}>
        Previous
    </button>
{/if}

{#if (skip <= orderedByCreation.length - 4)}
    <button on:click={() => skip += 4}>
        Next
    </button>
{/if}
