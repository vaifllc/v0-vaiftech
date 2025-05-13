"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AIShowcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl font-bold mb-6">Get a Custom Quote for Your Project</h2>
            <p className="text-muted-foreground mb-8">
              Our quote builder helps you create a customized project plan tailored to your specific needs. Select your
              project type, complexity, and requirements to receive an instant estimate.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Choose your project type</h3>
                  <p className="text-muted-foreground">
                    Select from websites, mobile apps, e-commerce solutions, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Specify your requirements</h3>
                  <p className="text-muted-foreground">Customize features, complexity, and project scope</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Get your instant quote</h3>
                  <p className="text-muted-foreground">Receive a detailed estimate and schedule a consultation</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Link href="/quote-builder">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                  Build Your Custom Quote
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl border border-border/50">
              <Image
                src="/placeholder.svg?key=53etm"
                alt="Quote Builder Interface"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
