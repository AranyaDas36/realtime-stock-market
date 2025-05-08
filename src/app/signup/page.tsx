"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Alert, AlertDescription } from "@/app/components/ui/alert"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await signup(username, password)
      if (success) {
        router.push("/")
      } else {
        setError("Username already exists")
      }
    } catch (err) {
      setError("An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 p-4">
      <Card className="w-full max-w-md bg-gray-900 text-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription className="text-gray-400">Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 text-red-300 border-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="Jane"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="space-y-2 my-5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="Jane"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline text-white">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
