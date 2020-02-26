export type Content = {
    url: string,
    type: 'image' | 'video'
}

export type Tag = {
    name: string,
    color: string
}

export type Memory = {
    id: number,
    title: string,
    tag?: Tag,
    location: string,
    date: string,
    pictureCount: number,
    videoCount: number,
    content: Content[]
}