export type Content = {
    fileKey: string,
    contentType: 'image' | 'video',
    contentId: number
}

export type MemoryDescription = {
    tag?: string,
    title: string,
    location: string,
    date: number
}

export type Memory = MemoryDescription & {
    id: number,
    imageCount: number,
    videoCount: number,
    displayContent: Content,
    content: Content[]
}