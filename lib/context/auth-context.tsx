"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Types for our authentication context
type User = {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

// Sample user data for demonstration
const SAMPLE_USERS = [
  {
    id: "1",
    email: "admin@vaiftech.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    avatar: "/admin-avatar.png",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Demo User",
    role: "user" as const,
    avatar: "/user-avatar.png",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("vaiftech_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("vaiftech_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user with matching credentials
      const matchedUser = SAMPLE_USERS.find((u) => u.email === email && u.password === password)

      if (!matchedUser) {
        throw new Error("Invalid credentials")
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = matchedUser

      // Store user in state and localStorage
      setUser(userWithoutPassword)
      localStorage.setItem("vaiftech_user", JSON.stringify(userWithoutPassword))

      // Redirect based on role
      if (userWithoutPassword.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists
      if (SAMPLE_USERS.some((u) => u.email === email)) {
        throw new Error("Email already in use")
      }

      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: `${SAMPLE_USERS.length + 1}`,
        email,
        name,
        role: "user" as const,
      }

      // Store user in state and localStorage
      setUser(newUser)
      localStorage.setItem("vaiftech_user", JSON.stringify(newUser))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("vaiftech_user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
