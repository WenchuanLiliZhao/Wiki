"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from './sidebar.module.scss';

// List of allowed pages to display in the sidebar
const allowedPages = ["distance-formula", "pythagorean-theorem"] // Replace with your desired slugs

export function Sidebar() {
  const [pages, setPages] = useState<{ slug: string; title: string }[]>([])
  const pathname = usePathname()

  useEffect(() => {
    async function fetchPages() {
      const response = await fetch("/api/pages")
      const data = await response.json()

      // Filter pages to only include allowed ones
      const filteredPages = data.filter((page: { slug: string }) =>
        allowedPages.includes(page.slug)
      )
      setPages(filteredPages)
    }

    fetchPages()
  }, [])

  return (
    <>
      {/* Sidebar */}
      <div
        className={styles["sidebar"]}
      >
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold">
            Math Wiki
          </Link>

          <nav className="mt-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pages</h2>
            <ul className="space-y-1">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className={`flex items-center px-2 py-2 text-sm rounded-md ${
                      pathname === `/${page.slug}`
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{page.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
