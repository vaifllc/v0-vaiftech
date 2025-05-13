"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, FileText, Layers } from "lucide-react"

// Product data
const products = [
  {
    id: 1,
    title: "E-Commerce Starter Kit",
    description: "Complete e-commerce solution with payment processing and inventory management.",
    price: 149,
    category: "Web Development",
    image: "/e-commerce-dashboard.png",
    icon: Layers,
    popular: true,
  },
  {
    id: 2,
    title: "AI Chatbot Framework",
    description: "Build intelligent chatbots with natural language processing capabilities.",
    price: 99,
    category: "AI Tools",
    image: "/ai-chatbot-interface.png",
    icon: Code,
  },
  {
    id: 3,
    title: "Modern UI Component Library",
    description: "Extensive collection of customizable UI components for web applications.",
    price: 79,
    category: "UI/UX",
    image: "/ui-components-library.png",
    icon: Layers,
  },
  {
    id: 4,
    title: "Full-Stack Development Guide",
    description: "Comprehensive guide to modern full-stack development practices and tools.",
    price: 49,
    category: "eBooks",
    image: "/programming-book-cover.png",
    icon: FileText,
  },
]

export default function Products() {
  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Digital Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Explore our collection of premium digital products designed to accelerate your projects
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full flex flex-col overflow-hidden group">
                <div className="relative">
                  <div className="overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {product.popular && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-600">
                      Popular
                    </Badge>
                  )}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <product.icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {product.category}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-border/50 pt-4">
                  <div className="font-bold">
                    ${product.price}
                    <span className="text-xs text-muted-foreground font-normal ml-1">USD</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button variant="outline" className="group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
