<script lang="ts">
 import { bigIndexRows } from '$lib/stores'
 import { get as stored } from 'svelte/store'
 import SvelteTable from "svelte-table"

 // TODO: compare performance with https://github.com/mattiash/svelte-tablesort
 // ... or just drop in a "datagrid" library

 const columns = [
     {
         key: "title",
         title: "Note",
         value: v => v.title,
         sortable: true,
         // case-insensitive search
         // NOTE: the result lacks a label element
         // is there a searchLabel or some such option?
         // searchValue: (v, s) => v.title.toLowerCase().includes(s.toLowerCase()),
         renderValue: v =>
              (v.hidden ? `<a class="${v.hidden}"` : '<a') +
             ` href="/${v.permalink}/${v.slug}">${v.title}</a>`,
         parseHTML: true,
     },
     {
         key: "links",
         title: "Links",
         value: v => v.links,
         sortable: true,
         headerClass: 'links-header',
     },
     {
         key: "wordcount",
         title: "Words",
         value: v => v.wordcount,
         sortable: true,
         headerClass: 'words-header',
     },
     {
         key: "created",
         title: "Created",
         value: v => v.created,
         renderValue: v => v.created_fancy.replaceAll('-', '‑'),
         sortable: true,
     },
 ]

</script>
<svelte:head>
	<title>All posts</title>
    <meta name="description" content="List of blog posts.">
</svelte:head>

<div id="the-big-index"
     data-sveltekit-preload-data="off"
     data-sveltekit-preload-code="off">
    <SvelteTable columns="{columns}"
                 rows="{stored(bigIndexRows)}"
                 sortBy="created"
                 sortOrder=-1>
    </SvelteTable>
</div>
