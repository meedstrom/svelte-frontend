<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { seen } from '$lib/stores'
 import { afterNavigate } from '$app/navigation'
 afterNavigate(() => {
     seen.update(x => x.add(data.post.pageid))
 })
</script>

<svelte:head>
    <title>{data.post.title}</title>
    {#if data.post.description}
        <meta name="description" content={data.post.description}>
    {/if}
</svelte:head>

<article data-sveltekit-preload-data="hover"
         data-sveltekit-preload-code="eager"
         class="h-entry">
    <h1 class="p-name" id={data.post.pageid}>
    {data.post.title}
</h1>
<Note data={data} />
</article>
