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

 $allowedTags = []
 $storedPostKey = ""
 $privPosts = new Map()
 $privMeta = new Map()

 $bigIndexRows = [...stored(pubMeta).values()]
     .filter((post) => !post.tags.includes('stub'))
     .filter((post) => !post.tags.includes('tag'))
     .sort((a, b) => b.created.localeCompare(a.created))
</script>

<h1>Logged out</h1>
<style>
 h1 {
     text-align: center;
     padding: 3em;
 }
</style>
