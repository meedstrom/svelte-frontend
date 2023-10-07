<script>
 import { goto, afterNavigate } from '$app/navigation'
 import { page } from '$app/stores'
 import { get } from 'svelte/store'
 import { posts } from '$lib/stores'
 const post = get(posts).find((post) => post.slug === $page.urlparam)
 // afterNavigate(() => {
     if (post) goto(`/${post.permalink}/${post.slug}`)
 // })
</script>

<h1>{$page.error.message}</h1>
