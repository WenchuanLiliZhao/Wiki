import { getAllPages } from "@/lib/wiki-utils"
import { getAllCanvasFiles } from "@/lib/canvas-utils"
import Link from "next/link"

export default async function HomePage() {
  const pages = await getAllPages()
  const canvasFiles = await getAllCanvasFiles()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Math Wiki</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Pages</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            // Construct the wiki URL using the page slug
            const wikiUrl = `/wiki/${page.slug}`;
            
            return (
              <Link
                key={page.slug}
                href={wikiUrl}
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
            );
          })}
        </div>
      </div>

      {canvasFiles.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Canvas Files</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {canvasFiles.map((canvas) => (
              <Link
                key={canvas.slug}
                href={`/canvas/${canvas.slug}`}
                className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{canvas.slug}</h2>
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2h12v10H4V3z" clipRule="evenodd" />
                  </svg>
                  Obsidian Canvas
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
