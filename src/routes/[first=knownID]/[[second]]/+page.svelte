<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get as stored } from 'svelte/store'
 import { allowedTags } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'
 if (stored(allowedTags).length > 0)
     goto(`/unlocked/${$page.params.first}/${$page.params.second}`)
</script>
<Note data={data} />
