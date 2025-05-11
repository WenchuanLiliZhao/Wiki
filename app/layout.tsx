import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import "katex/dist/katex.min.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Math Wiki",
  description: "A personal wiki for mathematical concepts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  )
}
