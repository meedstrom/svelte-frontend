export type Post = {
    slug: string
    pageid: string
    title: string
    created: string
    updated: string | null
    created_fancy: string
    updated_fancy: string | null
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
