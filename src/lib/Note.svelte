<script lang="ts">
 export let data
 import { get as stored } from 'svelte/store'
 import { seen, allowedTags, privateTags, } from '$lib/stores'
 import { afterNavigate } from '$app/navigation'
 afterNavigate(() => {
     seen.update(x => x.add(data.post.permalink))
 })

 function stripLinksToHidden(markup, showTags) {
     if (!markup) {
         console.log('no post provided')
         return
     }
     let willUnlink = new Set([...privateTags])
     showTags.forEach(tag => willUnlink.delete(tag))
     const willUnlinkRegex = [...willUnlink].join('|')
     // prolly safe, my html has no nested <a> tags
     const re = new RegExp(
         '<a +?class="[^\"]*?(?:' + willUnlinkRegex + ').*?>(.*?)</a>',
         'gs'
     )
     return markup.replaceAll(re, '$1')
 }

 function daysSince(then: string): string {
     const unixNow = new Date().getTime()
     const unixThen = new Date(then).getTime()
     const days = Math.round((unixNow - unixThen) / (1000 * 60 * 60 * 24))
     return (days === 1) ? 'yesterday'
          : (days === 0) ? 'today'
          : (days > 547) ? `${Math.round(days/365)} years ago`
          : (days > 45) ? `${Math.round(days/30)} months ago`
          : (days > 10) ? `${Math.round(days/7)} weeks ago`
          : `${days} days ago`
 }

 $: isDaily = data.dailies && data.post.tags.includes('daily') ? true : false
 // INFO: They're pre-sorted by creation-date, so that smaller index = newer.
 $: prev = isDaily ? data.dailies.find(post =>
     data.dailySlugs.indexOf(post.slug) > data.dailySlugs.indexOf(data.post.slug)
 ) : null
 $: next = isDaily ? data.dailies.toReversed().find(post =>
     data.dailySlugs.indexOf(post.slug) < data.dailySlugs.indexOf(data.post.slug)
 ) : null
</script>

<svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.description ?? "A note."}>
</svelte:head>

<article data-sveltekit-preload-data="hover"
         data-sveltekit-preload-code="eager">
    {#if isDaily}
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
        </div>
    {/if}
    <h1 id={data.post.permalink}>{data.post.title}</h1>
    {@html stripLinksToHidden(data.content, stored(allowedTags))}
    <div class="row">
        <div></div>
        <div>
            <small>Created
                <time datetime={data.post.created} class="dt-published">
                    {data.post.created_fancy}
                </time>
                ({daysSince(data.post.created)})
            </small>
            <br>
            <small>Updated
                <time datetime={data.post.updated} class="dt-updated">
                    {data.post.updated_fancy}
                </time>
                ({daysSince(data.post.updated)})
            </small>
        </div>
    </div>
</article>
