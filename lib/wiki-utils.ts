import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

const contentDirectory = path.join(process.cwd(), "content")

export interface WikiPage {
  slug: string
  title: string
  content: string
  excerpt: string
  summary: string
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

    const { content, data } = matter(fileContents)

    // Create an excerpt from the content
    const excerpt = content
      .replace(/\[\[(.*?)\]\]/g, "$1") // Remove wiki link syntax
      .replace(/\$\$(.*?)\$\$/g, "") // Remove math blocks
      .replace(/\$(.*?)\$/g, "") // Remove inline math
      .slice(0, 150)
      .trim()

    // Determine title: use first Heading 1 ("# ") in markdown body; if absent, fallback to file name (slug)
    const headingMatch = content.match(/^#\s+(.+)$/m)

    // Get summary from frontmatter or first paragraph
    let summary = data.summary
    if (!summary) {
      // Get first non-heading paragraph (text separated by blank lines)
      const paragraphs = content
        .split(/\n\s*\n/) // split by blank lines
        .map((p) => p.trim())
        .filter(Boolean)

      // Find the first paragraph that is not a markdown heading (does not start with "#")
      const firstParagraph = paragraphs.find((p) => !p.startsWith("#")) || ""

      // Remove wiki link syntax (e.g., [[Page]]) from the generated summary
      summary = firstParagraph.replace(/\[\[(.*?)\]\]/g, "$1")
    }

    return {
      slug,
      title: headingMatch ? headingMatch[1].trim() : slug,
      content,
      excerpt: excerpt + (excerpt.length >= 150 ? "..." : ""),
      summary,
    }
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error)
    return null
  }
}
