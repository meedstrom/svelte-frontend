<script lang="ts">
 import { onMount } from 'svelte'
 import { goto } from '$app/navigation'
 import { posts, seen } from '$lib/stores'
 onMount(() => {
     if ($posts.length > 0) {
         // TODO: Maybe it's ok to visit the stubs
         let nonStubLinks = new Set<string>(
             $posts.filter(x => !x.tags.includes('stub'))
                   .map(x => x.permalink)
         )
         // NOTE: set-difference is coming to JS
         // https://github.com/tc39/proposal-set-methods
         for (const link of $seen) {
             nonStubLinks.delete(link)
         }
         const unseen = [...nonStubLinks]
         const randomPermalink = unseen[Math.floor(Math.random() * unseen.length)]
         const randomPost = $posts.find(x => x.permalink === randomPermalink)
         const slug = randomPost ? randomPost.slug : ''
         goto(`/${randomPermalink}/${slug}`)
     }
 })
</script>
