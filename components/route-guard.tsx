"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export default function RouteGuard({ children, requireAuth = true, requireAdmin = false }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only run after initial loading is complete
    if (!isLoading) {
      // If authentication is required and user is not authenticated, redirect to login
      if (requireAuth && !isAuthenticated) {
        router.push("/login")
      }

      // If admin access is required and user is not an admin, redirect to dashboard
      if (requireAdmin && (!isAuthenticated || user?.role !== "admin")) {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, requireAdmin, requireAuth, router, user])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication check is complete and conditions are met, render children
  if (
    !isLoading &&
    (!requireAuth || isAuthenticated) &&
    (!requireAdmin || (isAuthenticated && user?.role === "admin"))
  ) {
    return <>{children}</>
  }

  // Otherwise, render nothing while redirecting
  return null
}
