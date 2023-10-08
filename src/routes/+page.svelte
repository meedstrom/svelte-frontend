<script lang="ts">
 import { postsMetadata } from '$lib/stores'
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
         renderValue: v => {
             if (v.hidden)
                 return `<a class="${v.hidden}" href="${v.permalink}/${v.slug}">${v.title}</a>`
             else return `<a href="${v.permalink}/${v.slug}">${v.title}</a>`
         },
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

</script>
<svelte:head>
	<title>All posts</title>
    <meta name="description" content="List of blog posts.">
</svelte:head>

<div id="the-big-index">
    <SvelteTable columns="{columns}"
                 rows="{get(postsMetadata).filter(post => !post.tags.includes('stub'))}"
                 sortBy="created"
                 sortOrder=-1
    >
    </SvelteTable>
</div>
