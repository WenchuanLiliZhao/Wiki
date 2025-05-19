import fs from "fs/promises"
import path from "path"

const contentDirectory = path.join(process.cwd(), "content")

export interface CanvasFile {
  slug: string
  content: string
  filename: string
}

// Recursively scan directories to find all .canvas files
async function scanDirectory(dir: string, basePath: string = ""): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    const filesPromises = entries.map(async (entry) => {
      const resolvedPath = path.join(dir, entry.name);
      const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
      
      try {
        if (entry.isDirectory()) {
          return scanDirectory(resolvedPath, relativePath);
        } else if (entry.name.endsWith(".canvas")) {
          return [relativePath];
        }
        return [];
      } catch (error) {
        console.error(`Error processing ${resolvedPath}:`, error);
        return [];
      }
    });
    
    const filesArrays = await Promise.all(filesPromises);
    return filesArrays.flat();
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
    return [];
  }
}

/**
 * Get a canvas file by its slug
 */
export async function getCanvasBySlug(slug: string): Promise<CanvasFile | null> {
  try {
    // Add .canvas extension to the slug to get the file path
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
    // Get all canvas files recursively
    const files = await scanDirectory(contentDirectory);
    
    const canvasData = await Promise.all(
      files.map(async (file) => {
        // Convert file path to URL slug (remove .canvas extension)
        const slug = file.replace(/\.canvas$/, "")
        const filePath = path.join(contentDirectory, file)
        const content = await fs.readFile(filePath, "utf8")
        
        return {
          slug,
          content,
          filename: file
        }
      })
    )
    
    return canvasData
  } catch (error) {
    console.error("Error getting canvas files:", error)
    return []
  }
} 