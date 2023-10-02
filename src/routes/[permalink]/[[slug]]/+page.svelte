<script lang="ts">
 export let data
 import { get } from 'svelte/store'
 import { seen, posts } from '$lib/stores'
 import { afterNavigate } from '$app/navigation'
 afterNavigate(() =>
     seen.update(x => x.add(data.post.permalink))
 )

 function daysSince(then: string): string {
     const unixNow = new Date().getTime()
     const unixThen = new Date(then).getTime()
     const days = Math.round((unixNow - unixThen) / (1000 * 60 * 60 * 24))
     return (days === 1) ? 'yesterday'
          : (days === 0) ? 'today'
          : (days > 550) ? `${Math.round(days/365)} years ago`
          : (days > 45) ? `${Math.round(days/30)} months ago`
          : (days > 25) ? 'a month ago'
          : `${days} days ago`
 }

 const dailies = get(posts).filter(post => post.tags.includes('daily'))
 const dailySlugs = dailies.map(post => post.slug)
 $: isDaily = data.post.tags.includes('daily') ? true : false
 // INFO: They're pre-sorted by creation-date, so that lower index = newer.
 $: prev = isDaily ? dailies.find(post =>
     dailySlugs.indexOf(post.slug) > dailySlugs.indexOf(data.post.slug)) : null
 $: next = isDaily ? dailies.toReversed().find(post =>
     dailySlugs.indexOf(post.slug) < dailySlugs.indexOf(data.post.slug)) : null

</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<article>
    <div class="row">
        <div>
            {#if prev}
                <a href="/{prev.permalink}/{prev.slug}">← {prev.slug}</a>
            {/if}
        </div>
        <div>
            {#if next}
                <a href="/{next.permalink}/{next.slug}">{next.slug} →</a>
            {/if}
        </div>
        <div>
            <small>Created
                <time datetime={data.post.created} class="dt-published hideOnPhone">
                    {data.post.created_fancy},
                </time>
                {daysSince(data.post.created)}
            </small>
            <br>
            <small class="hideOnPhone">Updated
                <time datetime={data.post.updated} class="dt-updated hideOnPhone">
                    {data.post.updated_fancy},
                </time>
                {daysSince(data.post.updated)}
            </small>
        </div>
    </div>
    <h1>{data.post.title}</h1>
    {@html data.post.content}
</article>


<style>
 .hideOnPhone {
     @media (max-width: 684px) {
         display: none;
     }
 }
 div.row {
     display: flex;
     justify-content: space-between;
     /* align-items: center; */
 }
 /* h1 { margin-top: 0; } */
</style>
