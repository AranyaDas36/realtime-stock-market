"use client"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"

export default function Navbar() {
  const { user, logout } = useAuth()

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", 
    month: "long", 
    day: "numeric", 
  });

  return (
    <nav className="w-full bg-gray-950 pt-5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">

        {user && (
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-gray-300">Hello, {user.username}</span>
            <span className="text-gray-400">{today}</span> 
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <Button className="bg-red-500 hover:bg-red-800 cursor-pointer" variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
