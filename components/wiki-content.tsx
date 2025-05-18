"use client"

import { useEffect, useRef } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify"
import rehypeSanitize from "rehype-sanitize"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"

// Custom plugin to handle wiki links [[Page Name]] or [[Folder/Page Name]]
function remarkWikiLinks() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "text" && node.value.includes("[[")) {
        const segments = []
        let lastIndex = 0
        const regex = /\[\[(.*?)\]\]/g
        let match

        while ((match = regex.exec(node.value)) !== null) {
          // Text before the wiki link
          if (match.index > lastIndex) {
            segments.push({
              type: "text",
              value: node.value.slice(lastIndex, match.index),
            })
          }

          // The wiki link
          const linkText = match[1]
          
          // Handle paths in wiki links
          // If it's a nested path like "Folder/Page", preserve the structure
          // Otherwise, convert spaces to dashes for legacy formatting
          const slug = linkText.includes("/") 
            ? linkText.split("/").map(part => part.toLowerCase().replace(/\s+/g, "-")).join("/")
            : linkText.toLowerCase().replace(/\s+/g, "-")
            
          segments.push({
            type: "wikiLink",
            data: {
              hName: "a",
              hProperties: {
                href: `/wiki/${slug}`,
                className: "wiki-link",
              },
            },
            children: [{ type: "text", value: linkText }],
          })

          lastIndex = match.index + match[0].length
        }

        // Text after the last wiki link
        if (lastIndex < node.value.length) {
          segments.push({
            type: "text",
            value: node.value.slice(lastIndex),
          })
        }

        return segments
      }

      if (node.children) {
        const newChildren = []
        for (const child of node.children) {
          const result = visit(child)
          if (Array.isArray(result)) {
            newChildren.push(...result)
          } else {
            newChildren.push(child)
          }
        }
        node.children = newChildren
      }

      return node
    }

    visit(tree)
  }
}

export function WikiContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function renderContent() {
      const processor = unified()
        .use(remarkParse)
        .use(remarkWikiLinks)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeKatex, {
          macros: {
            "\\Tuple": "{\\left\\langle #1 \\right\\rangle}",
            "\\String": "{\\text{`} #1 \\text{'}}",
            "\\Numeral": "{\\tilde{#1}}",
            "\\StringAdd": "{^{\\frown}}",
          },
          trust: true,
        })
        .use(rehypeHighlight)
        .use(rehypeStringify)

      const result = await processor.process(content)

      if (contentRef.current) {
        contentRef.current.innerHTML = String(result)

        // Add click handlers to wiki links
        contentRef.current.querySelectorAll(".wiki-link").forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault()
            const href = (link as HTMLAnchorElement).getAttribute("href")
            if (href) {
              window.location.href = href
            }
          })
        })
      }
    }

    renderContent()
  }, [content])

  return <div ref={contentRef} className="wiki-content" />
}
