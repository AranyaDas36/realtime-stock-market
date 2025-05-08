import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import Navbar from "@/app/components/nabvar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Market Dashboard",
  description: "Track market performance and sectors",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-200`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
