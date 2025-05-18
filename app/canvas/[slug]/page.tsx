import { getCanvasBySlug, getAllCanvasFiles } from "@/lib/canvas-utils"
import { CanvasViewer } from "@/components/canvas-viewer"
import { InteractiveCanvasViewer } from "@/components/interactive-canvas-viewer"
import notFound from "@/app/not-found"

export async function generateStaticParams() {
  const canvasFiles = await getAllCanvasFiles()

  return canvasFiles.map((canvas) => ({
    slug: canvas.slug,
  }))
}

export default async function CanvasPage({
  params,
}: {
  params: { slug: string }
}) {
  const canvas = await getCanvasBySlug(params.slug)

  if (!canvas) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">{canvas?.slug}</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Interactive View</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {canvas && <InteractiveCanvasViewer content={canvas.content} />}
        </div>
      </div>
    </div>
  )
} 