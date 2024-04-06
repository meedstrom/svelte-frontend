<script lang="ts">
 export let data
 import Note from '$lib/Note.svelte'
 import { get as stored } from 'svelte/store'
 import { allowedTags } from '$lib/stores'
 import { page } from '$app/stores'
 import { goto } from '$app/navigation'

 // TODO: pregenerate list of ids in +page.server.ts instead of importing these
 //       fat(-ish) objects
 import { pubMeta, privMeta } from '$lib/stores'
 // import { match } from '$params/knownID

 if (stored(allowedTags).length > 0)
     goto(
         `/unlocked/${$page.params.first}/${$page.params.second}${$page.url.hash}`,
         { replaceState: true }
     )

 const hash = $page.url.hash.slice(1)
 const relocated = stored(pubMeta).get(hash) ?? stored(privMeta).get(hash)
 if (relocated) goto(`/${relocated.pageid}/${relocated.slug}`)

 const encodedTitle = encodeURIComponent(data.post.title)
</script>
<svelte:head>
    <title>{data.post.title}</title>
    {#if data.post.description}
        <meta name="description" content={data.post.description}>
    {/if}
    <link rel="canonical" href={`https://edstrom.dev/${data.post.pageid}/${data.post.slug}`}>
    <!-- <noscript> -->
    <img src={`https://edstromdev.goatcounter.com/count?p=/${data.post.pageid}/${data.post.slug}&t=${encodedTitle}`}
         rel="nofollow" alt=""
    >
    <!-- </noscript> -->
</svelte:head>
<article data-sveltekit-preload-data="hover"
         data-sveltekit-preload-code="eager"
         class="h-entry">
    <h1 class="p-name" id={data.post.pageid}>
        {data.post.title}
    </h1>
    <Note data={data} />
</article>
