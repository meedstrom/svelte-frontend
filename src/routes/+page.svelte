<script lang="ts">
 import { posts, postsMetadata } from '$lib/stores'
 import type { Post } from '$lib/stores'
 import { get } from 'svelte/store'
 import SvelteTable from "svelte-table"

 // TODO: switch to https://github.com/mattiash/svelte-tablesort

 // well, the search bar is good for people who don't know how to search a page
 // in their phones...

 const columns = [
     {
         key: "title",
         title: "Note",
         value: v => v.title,
         sortable: true,
         // case-insensitive search
         searchValue: (v, s) => v.title.toLowerCase().includes(s.toLowerCase()),
         renderValue: v => 
             '<a' +
              (v.hidden ? ` class="${v.hidden}"` : '') +
             ` href="/${v.permalink}/${v.slug}">${v.title}</a>`,
         parseHTML: true,
     },
     {
         key: "links",
         title: "Links",
         value: v => v.links,
         sortable: true,
     },
     {
         key: "wordcount",
         title: "Words",
         value: v => v.wordcount,
         sortable: true,
     },
     {
         key: "created",
         title: "Created",
         value: v => v.created.replaceAll('-', '‑'),
         sortable: true,
     },
 ]

// TODO: just pre-calc this in encrypt10.js, too... and then update in the login page
 const copy = JSON.parse(JSON.stringify(get(postsMetadata)))
 let rows = copy.filter(post => !post.tags.includes('stub'))
                .map(post => {
                    if (get(posts).length > 0)
                    post.permalink = `unlocked/${post.permalink}`
                    return post
                })


 //
 //  // TODO: is this recalculated every access, or does Svelte cache the result?
 //  $: rows = []
 //  ;(async () => {
 //      const copy = JSON.parse(JSON.stringify(get(postsMetadata)))
 //      rows = copy.filter(post => !post.tags.includes('stub'))
 //                 .map(post => {
 //                     post.permalink = `/hidden/{$post.permalink}`
 //                     return post
 //                 })
 //  })()
 //

</script>
<svelte:head>
	<title>All posts</title>
    <meta name="description" content="List of blog posts.">
</svelte:head>

<div id="the-big-index">
    <SvelteTable columns="{columns}"
                 rows="{rows}"
                 sortBy="created"
                 sortOrder=-1
    >
    </SvelteTable>
</div>
