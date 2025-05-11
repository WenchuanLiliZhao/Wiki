"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

export function Search() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ slug: string; title: string }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  function handleResultClick(slug: string) {
    router.push(`/wiki/${slug}`)
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search wiki..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1">
            {results.map((result) => (
              <li key={result.slug}>
                <button
                  onClick={() => handleResultClick(result.slug)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {result.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
