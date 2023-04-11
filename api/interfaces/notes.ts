export interface NoteRequestBody {
    name?: string
    status?: number
    keywords?: KeywordRequestBody[]
}

export interface KeywordRequestBody {
    posId?: number
}
