<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get as stored } from 'svelte/store'
 import { allowedTags } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'
 import idMappings from '$lib/idMappings.json'

 if (stored(allowedTags).length > 0)
     goto(`/unlocked/${$page.params.first}/${$page.params.second}`)

 // console.log(`hash is ${$page.url.hash}`)
 const updatedHash = idMappings[`${$page.url.hash.slice(1)}`]
 // console.log(`new hash is ${updatedHash}`)
 if (updatedHash)
     goto(`#${updatedHash}`)
</script>

<Note data={data} />
