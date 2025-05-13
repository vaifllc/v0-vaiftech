"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 border border-primary/20 w-fit">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI Technology</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block">Transform Your Digital</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                Experience with VAIF
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Custom development, digital products, and educational content powered by cutting-edge AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/quote-builder">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-purple-400 to-indigo-600"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">500+</span> clients trust our solutions
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* 3D-like layered interface mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform rotate-6 scale-95" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl transform rotate-3 scale-97" />
              <div className="relative bg-background/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Custom Project Quote</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-8 bg-muted/50 rounded-md w-3/4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/50 rounded-md w-full" />
                      <div className="h-8 bg-muted/30 rounded-md w-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/50 rounded-md w-full" />
                      <div className="h-8 bg-muted/30 rounded-md w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded-md w-1/2" />
                    <div className="h-24 bg-muted/30 rounded-md w-full" />
                  </div>
                  <div className="flex justify-end">
                    <div className="h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-md w-1/3" />
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center space-x-2 bg-background/80 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 shadow-lg">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Get Your Quote</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
