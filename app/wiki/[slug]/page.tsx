import { getPageBySlug, getAllPages } from "@/lib/wiki-utils"
import { notFound } from "next/navigation"
import { WikiContent } from "@/components/wiki-content"

export async function generateStaticParams() {
  const pages = await getAllPages()

  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: `${page.title} | Math Wiki`,
  }
}

export default async function WikiPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <article className="prose prose-lg max-w-none">
        <WikiContent content={page.content} />
      </article>
    </div>
  )
}
