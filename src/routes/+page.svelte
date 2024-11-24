<script lang="ts">
  import RecentNotes from "$lib/RecentNotes.svelte"
  import { goto } from "$app/navigation"
  import { get as stored } from "svelte/store"
  import { allowedTags } from "$lib/stores"
  if (stored(allowedTags).includes("shrink")) {
    goto("/unlocked/xhlpk/new-info-to-modigo")
  }
</script>

<svelte:head>
  <title>Martin Edström</title>
</svelte:head>
<RecentNotes data={{ params: { offset: 0 } }} />
