<script lang="ts">
 import { posts } from '$lib/stores'
 import SvelteTable from "svelte-table"

 // Bam, store updated from the fetch in the loader!
 if ($posts.length === 0) {
     $posts = data.posts
 }
     const columns = [
     {
         key: "title",
         title: "Note",
         value: v => v.title,
         sortable: true,
         // case-insensitive search
         searchValue: (v, s) => v.title.toLowerCase().includes(s.toLowerCase()),
         renderValue: v => `<a href="${v.permalink}/${v.slug}">${v.title}</a>`,
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

<SvelteTable columns="{columns}" rows="{$posts}"></SvelteTable>
