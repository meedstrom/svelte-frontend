<script lang="ts">
 import { get as stored } from 'svelte/store'
 import {
     privMeta,
     pubMeta,
     allowedTags,
     bigIndexRows,
     storedPostKey,
 } from '$lib/stores'
 import { privPosts } from '$lib/postContents'
 import privMetaJSON from '$lib/privMeta.json'
 import { browser } from "$app/environment";

 $allowedTags = []
 $storedPostKey = ""
 $privPosts = new Map()
 $privMeta = new Map()

 $bigIndexRows = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.includes('stub'))
     .filter((post) => !post.tags.includes('tag'))
     .sort((a, b) => b.created.localeCompare(a.created))

 function navBack () {
     if (browser) window.history.back()
 }
</script>

<svelte:head>
    <title>Logged out</title>
</svelte:head>
<h1>Logged out</h1>
<big><p><a on:click={navBack}>Go back</a></p></big>

<style>
 h1 { padding-top: 1em; }
 h1, big { text-align: center; }
</style>
