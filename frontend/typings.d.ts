export interface Post {
    _createdAt: string | number | Date;
    _id: string,
    publishedAt: string | number | Date;
    title: string,
    author: {
        name: string,
        image: string
    }
    description: string,
    mainImage: {
        asset: {
            url: string
        }
    },
    slug: {
        current: string
    },
    body: [object]
}