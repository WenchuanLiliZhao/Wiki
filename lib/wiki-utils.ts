import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

const contentDirectory = path.join(process.cwd(), "content/published")

export interface WikiPage {
  slug: string
  title: string
  content: string
  excerpt: string
  update?: string // Add update field
}

export async function getAllPages(): Promise<WikiPage[]> {
  try {
    const files = await fs.readdir(contentDirectory)

    const pages = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const slug = file.replace(/\.md$/, "")
          const page = await getPageBySlug(slug)
          return page
        }),
    )

    return pages.filter(Boolean) as WikiPage[]
  } catch (error) {
    console.error("Error reading content directory:", error)
    return []
  }
}

export async function getPageBySlug(slug: string): Promise<WikiPage | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.md`)
    const fileContents = await fs.readFile(filePath, "utf8")

    const { data, content } = matter(fileContents)

    // Create an excerpt from the content
    const excerpt = content
      .replace(/\[\[(.*?)\]\]/g, "$1") // Remove wiki link syntax
      .replace(/\$\$(.*?)\$\$/g, "") // Remove math blocks
      .replace(/\$(.*?)\$/g, "") // Remove inline math
      .slice(0, 150)
      .trim()

    return {
      slug,
      title: data.title || slug,
      content,
      excerpt: excerpt + (excerpt.length >= 150 ? "..." : ""),
      update: data.update, // Include update field
    }
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error)
    return null
  }
}
