import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

const contentDirectory = path.join(process.cwd(), "content")

export interface WikiPage {
  slug: string
  title: string
  content: string
  excerpt: string
}

export function slugify(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

export async function getAllPages(): Promise<WikiPage[]> {
  try {
    const files = await fs.readdir(contentDirectory);
    const pages = await Promise.all(
      files
        .filter((file) => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(contentDirectory, file);
          const fileContents = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(fileContents);
          const title = data.title || file.replace(/\.md$/, '');
          const slug = slugify(title);
          // Create an excerpt from the content
          const excerpt = content
            .replace(/\[\[(.*?)\]\]/g, '$1') // Remove wiki link syntax
            .replace(/\$\$(.*?)\$\$/g, '') // Remove math blocks
            .replace(/\$(.*?)\$/g, '') // Remove inline math
            .slice(0, 150)
            .trim();
          return {
            slug,
            title,
            content,
            excerpt: excerpt + (excerpt.length >= 150 ? '...' : ''),
          };
        })
    );
    return pages.filter(Boolean) as WikiPage[];
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<WikiPage | null> {
  try {
    const files = await fs.readdir(contentDirectory);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentDirectory, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const title = data.title || file.replace(/\.md$/, '');
        if (slugify(title) === slug) {
          const excerpt = content
            .replace(/\[\[(.*?)\]\]/g, '$1')
            .replace(/\$\$(.*?)\$\$/g, '')
            .replace(/\$(.*?)\$/g, '')
            .slice(0, 150)
            .trim();
          return {
            slug,
            title,
            content,
            excerpt: excerpt + (excerpt.length >= 150 ? '...' : ''),
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error);
    return null;
  }
}
