import { GetStaticProps } from 'next';
import React from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings';

interface Props {
    post: Post
}

const Post = ({post}: Props) => {
    console.log(post)
    return (
      <main>
          <Header/>
      </main>
    );
};

export default Post;



export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        publishedAt,
        title,
        description,
        body,
        slug,
        mainImage,
        author->{
            name,
            image
        },
        'comments': *[
            _type == "comment" && post._ref == ^._id && approved == true
        ]
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 60 //after 60 seconds, it'll update the old cached version of pages
    }
}