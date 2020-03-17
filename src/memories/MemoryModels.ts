export type Content = {
    url: string,
    type: 'image' | 'video'
}

export type MemoryDescription = {
    tag?: string,
    title: string,
    location: string,
    date: Date
}

export type Memory = MemoryDescription & {
    id: number,
    pictureCount: number,
    videoCount: number,
    content: Content[]
}