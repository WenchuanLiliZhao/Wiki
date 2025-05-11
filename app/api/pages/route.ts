import { getAllPages } from "@/lib/wiki-utils"
import { NextResponse } from "next/server"

export async function GET() {
  const pages = await getAllPages()

  // Return just the slug and title for the sidebar
  const simplifiedPages = pages.map((page) => ({
    slug: page.slug,
    title: page.title,
  }))

  return NextResponse.json(simplifiedPages)
}
