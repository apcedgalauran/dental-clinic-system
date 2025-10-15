"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)

      // Get user type from localStorage to redirect appropriately
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        // Redirect based on user type
        if (user.user_type === "patient") {
          router.push("/patient/dashboard")
        } else if (user.user_type === "staff") {
          router.push("/staff/dashboard")
        } else if (user.user_type === "owner") {
          router.push("/owner/dashboard")
        }
      }
    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-background)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--color-accent)] text-2xl font-bold">D</span>
            </div>
            <span className="text-xl font-semibold text-[var(--color-primary)]">Dental Clinic</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)] mb-2">Welcome Back</h1>
          <p className="text-[var(--color-text-muted)]">Sign in to access your account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Username or Email</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Don't have an account?{" "}
              <Link href="/" className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium">
                Register as Patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
