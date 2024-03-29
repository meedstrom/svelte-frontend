<script lang="ts">
 import type { Post, NoteData } from '$lib/types'
 export let data
 import 'iconify-icon'
 import { seen, allowedTags, privateTags, } from '$lib/stores'
 import { get as stored } from 'svelte/store'
 import { afterNavigate } from '$app/navigation'
 import { page } from '$app/stores'
 afterNavigate(() => {
     seen.update(x => x.add(data.post.permalink))
 })

 // TODO: Speed this  up
 function reformat(markup, showTags) {
     if (!markup) {
         console.log('no post provided')
         return
     }
     let result: string

     // Strip links to hidden posts
     let willUnlink = new Set([...privateTags])
     showTags.forEach((tag: string) => willUnlink.delete(tag))
     const willUnlinkRegex = [...willUnlink].join('|')
     // Prolly safe, my html has no nested <a> tags
     const stripRe = new RegExp(
         '<a +?class="[^\"]*?(?:' + willUnlinkRegex + ').*?>(.*?)</a>',
         'gs'
     )
     result = markup.replaceAll(stripRe, '$1')
     //
     //      console.log(stored(allowedTags))
     //      console.log(stripRe)
     //      console.log(result)
     //

     // Indicate 'unlocked' links with a 🗝 (dungeon key icon)
     const privateLinkRe = new RegExp(
         '(<a +?class="[^\"]*?(?:' + [...privateTags].join('|') + ').*?)</a>',
         'gs'
     )
     // result = result.replaceAll(privateLinkRe, '$1</a><NotoKey />')
     result = result.replaceAll(privateLinkRe, '$1</a><iconify-icon icon="noto:old-key"></iconify-icon>')

     return result
 }

 // TODO: try new Temporal web API (actually multi-meg polyfill so wait)
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
 $: prev = isDaily ?
           data.dailies.find(post =>
               data.dailySlugs.indexOf(post.slug)
               > data.dailySlugs.indexOf(data.post.slug)
           )
         : null
 $: next = isDaily ?
           data.dailies.toReversed().find(post =>
               data.dailySlugs.indexOf(post.slug)
               < data.dailySlugs.indexOf(data.post.slug)
           )
         : null

 const extraClasses = data.post.tags.includes("logseq") ? " logseq" : ''
</script>

{#if isDaily}
    <div class="row series">
        <div>
            {#if prev}
                <a rel="prev" href="/{prev.permalink}/{prev.slug}">
                    ← {prev.title}
                </a>
            {/if}
        </div>
        <div>
            {#if next}
                <a rel="next" href="/{next.permalink}/{next.slug}">
                    {next.title} →
                </a>
            {/if}
        </div>
    </div>
{/if}

<div class={`e-content ${extraClasses}`}>
    {@html reformat(data.content, stored(allowedTags))}
</div>

<div id="datestamp" class="row">
    <div></div>
    <div>
        <small>Created
            <time datetime={data.post.created} class="dt-published">
                {data.post.created_fancy}
            </time>
            ({daysSince(data.post.created)})
        </small>
        {#if data.post.updated}
            <br>
            <small>Updated
                <time datetime={data.post.updated} class="dt-updated">
                    {data.post.updated_fancy}
                </time>
                ({daysSince(data.post.updated)})
            </small>
        {/if}
    </div>
</div>

<style>
 #datestamp {
     margin-top: .4em;
     margin-right: .8em;
     padding-bottom: .2em;
 }
</style>
