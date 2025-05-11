import { getAllPages } from "@/lib/wiki-utils"
import Link from "next/link"
import { Search } from "@/components/search"

export default async function HomePage() {
  const pages = await getAllPages()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Math Wiki</h1>

      <div className="mb-8">
        <Search />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/${page.slug}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
            <p className="text-gray-600 line-clamp-2">{page.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
