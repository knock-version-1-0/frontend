export interface NoteData {
    name?: string
    status?: number
    keywords?: KeywordData[]
}

export interface KeywordData {
    posId?: number
    text?: string
}
