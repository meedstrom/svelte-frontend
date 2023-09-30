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

 // FIXME: None of these update when navigating to another daily

 // // Version 3  I like this, just need a bit of fiddling with ><
 //  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
 //  const isDaily = data.post.slug.match(dateRegex) ? true : false
 //  let prev
 //  let next
 //  if (isDaily) {
 //      const dailies = get(posts).filter(post => post.slug.match(dateRegex))
 //      const dailySlugs = dailies.map(post => post.slug)
 //      prev = dailies.find(post =>
 //          dailySlugs.indexOf(post) < dailySlugs.indexOf(data.post.slug))
 //      next = dailies.toReversed().find(post =>
 //          dailySlugs.indexOf(post) > dailySlugs.indexOf(data.post.slug))
 //  }

 // // Version 2 Harder to read, I think
 //  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
 //  const isDaily = data.post.slug.match(dateRegex) ? true : false
 //  function olderDaily(post, thanPost, older) {
 //      if (post.slug.match(dateRegex)) {
 //          let num = Number(post.slug.replaceAll('-', ''))
 //          let thanNum = Number(thanPost.slug.replaceAll('-', ''))
 //          return older ? num < thanNum : num > thanNum
 //      } else return false
 //  }
 //  const prev = isDaily ? get(posts).find(post => olderDaily(post, data.post, true)) : false
 //  const next = isDaily ? get(posts).find(post => olderDaily(post, data.post)) : false
 //

 // // Version 1
 // let isDaily = false
 // let prev
 // let next
 // function num(ymd: string) {
 //     return Number(ymd.replaceAll('-', ''))
 // }
 // if (data.post.slug.match(/^\d{4}-\d{2}-\d{2}$/)) {
 //     isDaily = true
 //     const dailySlugs =
 //         get(posts).map(post => post.slug)
 //                   .filter(slug => slug.match(/^\d{4}-\d{2}-\d{2}$/))
 //     const prevSlug = dailySlugs.find(slug => num(slug) < num(data.post.slug))
 //     const nextSlug = dailySlugs.toReversed()
 //                                .find(slug => num(slug) > num(data.post.slug))
 //     prev = get(posts).find(post => post.slug === prevSlug)
 //     next = get(posts).find(post => post.slug === nextSlug)
 // }

</script>

<svelte:head>
	<title>{data.post.title}</title>
</svelte:head>

<article>
    <div class="right"><small>Created <time class="dt-published">{data.post.created}</time> ({daysSince(data.post.created)})</small></div>
    <!-- <table style="width: 15em;">
         <tr>
         <td>Created</td> <td><time className='dt-published'>{data.post.created}</time></td>
         </tr>
         <tr>
         <td>Updated</td> <td><time className='dt-updated'>{data.post.updated}</time></td>
         </tr>
         </table>
    -->
    
    <!--
         {#if isDaily}
         {#if prev}
         <a href="/{prev.permalink}/{prev.slug}">← {prev.slug}</a>
         {/if}
         {#if next}
         <a href="/{next.permalink}/{next.slug}">← {next.slug}</a>
         {/if}
         {/if}
    -->
    {@html data.post.content}
</article>


<style>
 div.right {
     text-align: right;
     margin-bottom: 0;
     padding-bottom: 0;
 }
 /*
    table {
    width: 15em;
    border: 1px solid;
    }
  */
</style>
