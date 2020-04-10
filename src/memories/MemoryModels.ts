import { Tag } from "../tags/Tag"

export type Content = {
    fileKey: string,
    contentType: 'image' | 'video',
    contentId: number
}

export type MemoryDescription = {
    tag?: number,
    title: string,
    location: string,
    date: number
}

export type Memory = MemoryDescription & {
    tag?: Tag,
    id: number,
    imageCount: number,
    videoCount: number,
    displayContent?: Content,
    content: Content[]
}