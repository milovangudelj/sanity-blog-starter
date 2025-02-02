import { client, urlFor } from "@/lib/sanity";
import { Article } from "../../../../../interface";
import { notFound } from "next/navigation";
import Container from "@/components/container";
import Image from "next/image";
import { SanityDocument, groq } from "next-sanity";

export const dynamicParams = false;

export const categoryiesQuery = groq`*[_type == "categories"].slug.current`;

const articlesQuery = groq`*[_type == "articles" && category->title == $category]{
    _id,
    title,
    "category": category->title,
      "teaserImage": teaserImage.asset->url,
      "slug": slug.current,
  }
`;

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  const categories = (await client.fetch(categoryiesQuery)) as string[];

  console.log("categories", categories);
  return categories.map((category) => ({ category }));
}

async function getArticles(category: string) {
  const data = await client.fetch(articlesQuery, { category });
  return data as Article[];
}

export default async function CategoryPage({
  params: { category },
}: {
  params: { category: string };
}) {
  const data = await getArticles(category);

  console.log(category, data);

  return (
    <Container>
      <h1 className="text-5xl first-letter:uppercase py-8">{category}</h1>
      {data.length ? (
        <div className="">
          <div className="grid grid-cols-3">
            {data.map((article, i) => (
              <div key={i} className="px-6 py-8 border col-span-1">
                <Image
                  src={urlFor(article.teaserImage).url()}
                  width={500}
                  height={500}
                  alt="change me"
                  className="aspect-square object-cover"
                />
                <h1>{article.title}</h1>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-8">
          <p>No articles found in this category</p>
        </div>
      )}
    </Container>
  );
}

// export const articlesQuery = groq`*[_type == "articles" && category->title == defined(category)]{
//     _id,
//     title,
//     "category": category->title,
//       "teaserImage": teaserImage.asset->url,
//       "slug": slug.current,
// }`

// async function getSlugs(slug: string) {
//   const query = `*[_type == 'articles']{
//       "slug": slug.current,
//   }
// `

//   const data = await client.fetch(query)
//   console.log('data', data)
//   return data
// }

// // Return a list of `params` to populate the [slug] dynamic segment
// export async function generateStaticParams(category: string) {
//   const query = `*[_type == 'articles' && category->title == "${category}"]{
//     _id,
//     title,
//     "category": category->title,
//       "teaserImage": teaserImage.asset->url,
//       "slug": slug.current,
//   }
// `
//   const articles = await client.fetch(query)
//   return articles.map((article: Article) => ({
//     slug: article.slug,
//   }))
// }

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
// export default function Page({ params }) {
//   const { slug } = params
//   // ...
// }
