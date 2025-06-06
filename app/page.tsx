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
            {canvasFiles.map((canvas) => {
              // Get the basename for display purposes
              const displayName = canvas.slug.split('/').pop() || canvas.slug;
              
              return (
                <Link
                  key={canvas.slug}
                  href={`/canvas/${canvas.slug}`}
                  className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
                  {/* Display the path if it's in a subdirectory */}
                  {canvas.slug.includes('/') && (
                    <div className="text-sm text-gray-500 mt-2">
                      Path: {canvas.slug.substring(0, canvas.slug.lastIndexOf('/'))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
