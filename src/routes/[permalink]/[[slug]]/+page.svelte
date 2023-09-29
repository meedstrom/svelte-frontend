<script lang="ts">
 export let data
 import { seen } from '$lib/stores'
 import { afterNavigate } from '$app/navigation'
 afterNavigate(() =>
     seen.update(x => x.add(data.post.permalink))
 )
</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<article>

    <!-- <table style="width: 15em;">
         <tr>
         <td>Created</td> <td><time className='dt-published'>{data.post.created}</time></td>
         </tr>
         <tr>
         <td>Updated</td> <td><time className='dt-updated'>{data.post.updated}</time></td>
         </tr>
         </table>
    -->
    {@html data.post.content}
</article>
<!--
     <style>
     table {
     width: 15em;
     border: 1px solid;
     }
     </style> -->
