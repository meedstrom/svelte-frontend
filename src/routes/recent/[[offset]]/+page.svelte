<script lang="ts">
 export let data
 import RecentNotes from '$lib/RecentNotes.svelte'
</script>
<svelte:head>
    <title>Recent pages</title>
</svelte:head>
<RecentNotes data={data} />
