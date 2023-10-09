<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get } from 'svelte/store'
 import { allowedTags } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'
 if (get(allowedTags).length > 0)
     goto(`/unlocked/${$page.params.permalink}/${$page.params.slug}`)
</script>
<Note data={data} />
