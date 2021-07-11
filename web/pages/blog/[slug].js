import Image from 'next/image'
import Markdown from './../../components/Markdown';

export default function Post(data) {

    const post = data.post;

    console.log("Post: ", post)

    return (
        <div>
            <h1>{post.title}</h1>
            {post.featuredImage === undefined ? (<Image width="640" height="426" src={post.featuredImage.node.sourceUrl} />) : (<></>)}
            <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
            <p>Comments: {post.commentCount}</p>
            {/* <Markdown input={post.content}></Markdown> */}
            {post.comments.edges.map((comment) => {
                return (<li>{comment.node.content}</li>)
            })}
        </div>
    )

}

export async function getStaticProps(context) {

    const res = await fetch('https://dmrks.org/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query SinglePost($id: ID!, $idType: PostIdType!) {
                    post(id: $id, idType: $idType) {
                        title
                        slug
                        content
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                        commentCount
                        comments {
                            edges {
                              node {
                                id
                                content
                                date
                                author {
                                  node {
                                    email
                                    id
                                    name
                                    url
                                    ... on User {
                                      id
                                      email
                                      avatar {
                                        url
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                    }
                }
            `,
            variables: {
                id: context.params.slug,
                idType: 'SLUG'
            }
        })
    })

    console.log("check1")

    const json = await res.json()

    console.log("check2")

    console.log("Returned: ", json.data.post)

    return {
        props: {
            post: json.data.post,
        },
    }

}

export async function getStaticPaths() {

    const res = await fetch('https://dmrks.org/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query AllPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `})
    })

    const json = await res.json()
    const posts = json.data.posts.nodes;

    const paths = posts.map((post) => ({
        params: { slug: post.slug },
    }))

    return { paths, fallback: false }

}