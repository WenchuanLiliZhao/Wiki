import "./styles/__styles.scss"
import type React from "react"

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
      <body>
        <div className="flex min-h-screen">
          <main className="flex-1 bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  )
}
