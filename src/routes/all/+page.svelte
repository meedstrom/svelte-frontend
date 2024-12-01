<script lang="ts">
  import { bigIndexRows } from "$lib/stores"
  import { get as stored } from "svelte/store"
  import SvelteTable from "svelte-table"
  // import './tabulator.css'
  // import {TabulatorFull as Tabulator} from 'tabulator-tables';
  // import {onMount} from 'svelte';
  //
  // let tableComponent;
  //
  //  onMount(() => {
  //      new Tabulator(tableComponent, {
  //          data: stored(bigIndexRows), //link data to table
  //          reactiveData: true, //enable data reactivity
  //          // columns: columns, //define table columns
  //          index: "pageid",
  //          autoColumns: true,
  //      })
  //  })
  //

  const columns = [
    {
      key: "title",
      title: "Note",
      value: (v: any) => v.title,
      sortable: true,
      // Case-insensitive search.
      // NOTE: The result lacks a label element
      // Is there a searchLabel or some such option?
      // searchValue: (v, s) => v.title.toLowerCase().includes(s.toLowerCase()),
      renderValue: (v: any) =>
        (v.hidden ? '<iconify-icon icon="noto:old-key"></iconify-icon>' : "") +
        `<a href="/${v.pageid}/${v.slug}">${v.title}</a>`,
      // `<a href="/${v.pageid}/${v.slug}">${v.title}</a>`,
      parseHTML: true,
    },
    {
      key: "linkcount",
      title: "Links",
      value: (v: any) => v.linkcount,
      renderValue: (v: any) => (v.linkcount === 0 ? "" : v.linkcount),
      sortable: true,
      headerClass: "links-header",
    },
    {
      key: "wordcount",
      title: "Words",
      value: (v: any) => v.wordcount,
      sortable: true,
      headerClass: "words-header",
    },
    {
      key: "created",
      title: "Created",
      value: (v: any) => v.created,
      class: "created",
      sortable: true,
      headerClass: "creation-header",
    },
  ]
</script>

<svelte:head>
  <title>All posts</title>
  <meta name="description" content="List of blog posts." />
</svelte:head>

<div
  id="the-big-index"
  data-sveltekit-preload-data="off"
  data-sveltekit-preload-code="off"
>
  <!-- <div bind:this={tableComponent}></div> -->

  <SvelteTable
    {columns}
    rows={$bigIndexRows}
    sortBy="created"
    sortOrder={-1}
    sortOrders={[-1, 1]}
  ></SvelteTable>
</div>
