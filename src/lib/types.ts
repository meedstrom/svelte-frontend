export type Post = {
    slug: string
    pageid: string
    title: string
    created: string
    updated: string | null
    createdFancy: string
    updatedFancy: string | null
    tags: string[]
    hidden: boolean | null
    wordcount: number
    linkcount: number
    description: string | null
}

export type NoteData = {
    post: Post
    content: string | undefined
    id: string
    dailies: Post[] | undefined
    dailySlugs: string[] | undefined
}
