import { getAllPages } from "@/lib/wiki-utils"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  const pages = await getAllPages()

  // Simple search implementation
  const results = pages
    .filter((page) => {
      const searchContent = `${page.title} ${page.content}`.toLowerCase()
      return searchContent.includes(query.toLowerCase())
    })
    .map((page) => ({
      slug: page.slug,
      title: page.title,
    }))

  return NextResponse.json(results)
}
