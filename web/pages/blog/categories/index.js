import Link from 'next/link'
import Categories from '../../../components/Categories';

export default function CategoriesPage(data) {
  console.log("Categories: ", data.categories);
  return (
    <div>
      <Categories categories={data.categories.nodes}></Categories>
    </div>
  )
}

export async function getStaticProps(context) {

  const res = await fetch('https://dmrks.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          query: `
          query AllCategoriesQuery {
            categories {
                nodes {
                  id
                  slug
                  name
                }
              }
        }
          `,
      })
  })

  console.log("check1")

  const json = await res.json()

  console.log("check2")

  console.log("Returned: ", json.data.categories.nodes)

  return {
      props: {
          categories: json.data.categories,
      },
  }

}