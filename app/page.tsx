import { getAllPages } from "@/lib/wiki-utils"
import Link from "next/link"

export default async function HomePage() {
  const pages = await getAllPages()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Math Wiki</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/wiki/${page.slug}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
            <p className="text-gray-600 line-clamp-2">{page.summary}</p>
            {page.update && <p className="text-gray-600">Last updated: {page.update}</p>}
            {page.cover && (
              <div className="mt-2">
                <img
                  src={page.cover}
                  alt={page.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
