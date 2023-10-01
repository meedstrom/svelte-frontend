<script lang="ts">
 import { posts, privateTags } from '$lib/stores'
 import type { Post } from '$lib/stores'
 import { get } from 'svelte/store'
 import SvelteTable from "svelte-table"

 // make an actual new variable, not just a new reference
 // const newPosts = JSON.parse(JSON.stringify(get(posts)))
 //
 // $: postsForTable =
 //         newPosts.map((post: Post) => {
 //         // post.tags.find(tag => console.log(privateTags.has(tag)))
 //         if (post.locked === 'true') {
 //             post.title = `${post.title}🗝`
 //         }
 //         return post
 //     })

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
         // searchValue: (v, s) => v.title.toLowerCase().includes(s.toLowerCase()),
         renderValue: v => {
             // TODO: simply return the "locking-tag" as the value of locked, so it's easy to print
             if (v.locked === 'true')
                 return `<a class="eyes_therapist" href="${v.permalink}/${v.slug}">${v.title}</a>`
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
     {
         key: "updated",
         title: "Updated",
         value: v => v.updated.replaceAll('-', '‑'),
         sortable: true,
     }
 ]

</script>
<svelte:head>
	<title>All posts</title>
</svelte:head>

<div id="the-big-table">
    <SvelteTable columns="{columns}"
                 rows="{get(posts).filter(post => !post.tags.includes('stub'))}"
                 sortBy="created"
                 sortOrder=-1
    >
    </SvelteTable>
</div>
