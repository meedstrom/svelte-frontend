<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get as stored } from 'svelte/store'
 import { allowedTags } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'
 import idMappings from '$lib/idMappings.json'

 if (stored(allowedTags).length > 0)
     goto(
         `/unlocked/${$page.params.first}/${$page.params.second}${$page.url.hash}`,
         { replaceState: true }
     )

 const updatedHash = idMappings[`${$page.url.hash.slice(1)}`]
 if (updatedHash)
     goto(`#${updatedHash}`, { replaceState: true })
</script>

<svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.description ?? "A note."}>
</svelte:head>

<Note data={data} />
