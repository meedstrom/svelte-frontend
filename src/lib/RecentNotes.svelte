<script lang="ts">
 export let data
 import { get as stored } from 'svelte/store'
 import { pubMeta, privMeta } from '$lib/stores'
 import { pubPosts, privPosts } from '$lib/postContents'
 import Note from '$lib/Note.svelte'
 import type { Post, NoteData } from '$lib/types'

 const orderedByCreation = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.find((tag) => ['daily', 'stub', 'tag'].includes(tag)))
     .sort((b, a) => (b.updated ?? b.created).localeCompare((a.updated ?? a.created)))
 const max = orderedByCreation.length

 $: offset = data.params.offset ? Number(data.params.offset) : max - 4
 $: notesToShow = orderedByCreation
     .slice(0 + offset, 4 + offset)
     .toReversed()
     .map((meta) => new Object({
         post: meta,
         content: $pubPosts.get(meta.pageid),
         id: meta.pageid,
     }))
</script>

<div class="paginator" id="paginator1">
    <div>
    {#if (offset >= 4) }
        <a rel="prev" href={`/recent/${offset - 4}`}>Older</a>
    {:else}
        <span>Older</span>
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset < orderedByCreation.length - 4)}
        <a rel="next" href={`/recent/${offset + 4}`}>Newer</a>
    {:else}
        <span>Newer</span>
    {/if}
    </div>
</div>

{#each notesToShow as data}
    <article data-sveltekit-preload-data="hover"
             data-sveltekit-preload-code="eager"
             class="h-entry">
        <h1 class="p-name" id={data.post.pageid}>
            <a href={`/${data.post.pageid}/${data.post.slug}`}>
                {data.post.title}
            </a>
        </h1>
        <Note data={data} />
    </article>
{/each}

<div class="paginator" id="paginator2">
    {#if (offset >= 4) }
        <a rel="prev" href={`/recent/${offset - 4}`}>Older</a>
    {:else}
        <span>Older</span>
    {/if}
    Showing {offset + 1} to {offset + 4}
    {#if (offset < orderedByCreation.length - 4)}
        <a rel="next" href={`/recent/${offset + 4}`}>Newer</a>
    {:else}
        <span>Newer</span>
    {/if}
</div>

<style>
 div.paginator {
     /* margin-left: auto; */
     margin-left: auto;
     margin-right: auto;
     width: fit-content;
     background-color: var(--bg);
     padding: .5em;
     margin-bottom: .5em;
 }

 div.paginator a,
 div.paginator span {
     padding: .5em;
 }
 /* Never color the pagination links as visited */
 div.paginator a:visited {
     color: var(--blossom);
 }
 #paginator1 {
     width: 100%;
     padding-right: 0;
     padding-left: 0;
     /* blend in better with the header  */
     box-shadow: -1px 2px 3px black;
     border-radius: 0 0 2px 2px;
 }
 #paginator1 > div {
     width: fit-content;
     margin: auto;
 }
 #paginator2 {
     margin-top: -2em;
 }

</style>
