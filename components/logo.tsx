"use client"
import Link from "next/link"
import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: {
      container: "w-8 h-8",
      text: "text-lg",
    },
    md: {
      container: "w-10 h-10",
      text: "text-xl",
    },
    lg: {
      container: "w-12 h-12",
      text: "text-2xl",
    },
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${sizes[size].container} overflow-hidden`}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Rounded square background */}
          <rect x="0" y="0" width="100" height="100" rx="20" fill="url(#logoGradient)" />

          {/* Tech-inspired elements */}
          <path
            d="M30,30 L70,30 L70,70 L30,70 Z"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* V shape */}
          <path
            d="M35,35 L50,65 L65,35"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circuit-like details */}
          <circle cx="50" cy="65" r="4" fill="white" />
          <circle cx="35" cy="35" r="4" fill="white" />
          <circle cx="65" cy="35" r="4" fill="white" />

          <path d="M20,50 L30,50" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
          <path d="M70,50 L80,50" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,20 L50,30" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>
      <span
        className={`font-bold ${sizes[size].text} bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600`}
      >
        VAIF TECH
      </span>
    </Link>
  )
}
