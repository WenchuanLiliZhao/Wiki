"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronRight } from "lucide-react"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [pages, setPages] = useState<{ slug: string; title: string }[]>([])
  const pathname = usePathname()

  useEffect(() => {
    async function fetchPages() {
      const response = await fetch("/api/pages")
      const data = await response.json()
      setPages(data)
    }

    fetchPages()
  }, [])

  useEffect(() => {
    // Close sidebar on mobile when navigating
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-50 top-4 left-4 md:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 transition duration-200 ease-in-out md:static md:w-64 lg:w-72 bg-white border-r border-gray-200 overflow-y-auto`}
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
                    href={`/wiki/${page.slug}`}
                    className={`flex items-center px-2 py-2 text-sm rounded-md ${
                      pathname === `/wiki/${page.slug}`
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight size={16} className="mr-2 flex-shrink-0" />
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
