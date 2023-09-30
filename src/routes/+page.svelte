<!--

     Not sure if it's possible, but if we could disable SSR and enable
     prerendering, then the <noscript> here should stay visible and +page.ts
     won't redirect us to /all.  Thus saving on server resources?

-->

<svelte:head>
    <noscript>
        <!-- <SvelteTable></SvelteTable> -->
    </noscript>
</svelte:head>
