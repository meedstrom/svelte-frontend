<script lang="ts">
 export let data
 import { seen } from '$lib/stores'
 import { afterNavigate } from '$app/navigation'
 afterNavigate(() =>
     seen.update(x => x.add(data.post.permalink))
 )
</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<main>
    {@html data.post.content}
</main>
