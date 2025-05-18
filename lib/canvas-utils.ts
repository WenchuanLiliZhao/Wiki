import fs from "fs/promises"
import path from "path"

const contentDirectory = path.join(process.cwd(), "content")

export interface CanvasFile {
  slug: string
  content: string
  filename: string
}

/**
 * Get a canvas file by its slug
 */
export async function getCanvasBySlug(slug: string): Promise<CanvasFile | null> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.canvas`)
    const fileContents = await fs.readFile(filePath, "utf8")

    return {
      slug,
      content: fileContents,
      filename: `${slug}.canvas`
    }
  } catch (error) {
    console.error(`Error reading canvas ${slug}:`, error)
    return null
  }
}

/**
 * Get all canvas files from the content directory
 */
export async function getAllCanvasFiles(): Promise<CanvasFile[]> {
  try {
    const files = await fs.readdir(contentDirectory)
    const canvasFiles = files.filter(file => file.endsWith(".canvas"))
    
    const canvasData = await Promise.all(
      canvasFiles.map(async (filename) => {
        const slug = filename.replace(".canvas", "")
        const filePath = path.join(contentDirectory, filename)
        const content = await fs.readFile(filePath, "utf8")
        
        return {
          slug,
          content,
          filename
        }
      })
    )
    
    return canvasData
  } catch (error) {
    console.error("Error getting canvas files:", error)
    return []
  }
} 