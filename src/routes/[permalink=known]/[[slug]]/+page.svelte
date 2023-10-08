<!-- NOTE: This file has two names! (hard link) -->
<!-- I don't think it's meant to be done this way... I'd like to figure out some
     solution with <slot> -->
<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get } from 'svelte/store'
 import { posts } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'
 if (get(posts).length > 0)
     goto(`/unlocked/${$page.params.permalink}/${$page.params.slug}`)
</script>
<Note data={data} />
