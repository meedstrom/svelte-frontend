<script lang="ts">
 import RecentNotes from '$lib/RecentNotes.svelte'
</script>
<svelte:head>
    <title>Martin Edström</title>
</svelte:head>
<RecentNotes data={ { params: { offset: 0 } } } />
