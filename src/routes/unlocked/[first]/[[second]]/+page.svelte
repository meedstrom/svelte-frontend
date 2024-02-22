<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
</script>

<svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.description ?? "A note."}>
</svelte:head>

<Note data={data} />
