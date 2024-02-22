export type Post = {
    slug: string
    permalink: string
    title: string
    created: string
    updated: string | null
    created_fancy: string
    updated_fancy: string | null
    wordcount: number
    links: number
    tags: string[]
    hidden: string | null
    description: string | null
}

export type NoteData = {
    post: Post
    content: string | undefined
    id: string
    dailies: Post[] | undefined
    dailySlugs: string[] | undefined
}
