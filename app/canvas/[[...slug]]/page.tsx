import { getCanvasBySlug, getAllCanvasFiles } from "@/lib/canvas-utils"
import { InteractiveCanvasViewer } from "@/components/svg/interactive-canvas-viewer"
import { notFound } from "next/navigation"
import path from "path"

export async function generateStaticParams() {
  const canvasFiles = await getAllCanvasFiles()

  return canvasFiles.map((canvas) => ({
    // Split the slug into segments for the catch-all route
    slug: canvas.slug.split(path.sep),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}) {
  // Join the slug segments to create the full slug path
  const slugPath = params.slug ? params.slug.join("/") : "";
  const canvas = await getCanvasBySlug(slugPath);

  if (!canvas) {
    return {
      title: "Canvas Not Found",
    };
  }

  // Get the basename for title display
  const baseName = path.basename(canvas.slug);

  return {
    title: `${baseName} | Canvas Viewer`,
  };
}

export default async function CanvasPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  // Join the slug segments to create the full slug path
  const slugPath = params.slug ? params.slug.join("/") : "";
  const canvas = await getCanvasBySlug(slugPath);

  if (!canvas) {
    notFound();
  }

  // Get the basename for title display
  const baseName = path.basename(canvas.slug);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">{baseName}</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Interactive View</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {canvas && <InteractiveCanvasViewer content={canvas.content} />}
        </div>
      </div>
    </div>
  );
} 