"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Lightbulb, Calendar, FileSignature, Bot, Users, Code, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Feature data
const features = [
  {
    icon: ShoppingBag,
    title: "Digital Storefront",
    description: "Browse and purchase digital products with ease.",
    color: "from-purple-500 to-indigo-700",
  },
  {
    icon: Lightbulb,
    title: "Training Hub",
    description: "Access educational content and courses for skill development.",
    color: "from-indigo-500 to-blue-700",
  },
  {
    icon: Calendar,
    title: "Booking System",
    description: "Schedule meetings and consultations with our experts.",
    color: "from-blue-500 to-purple-700",
  },
  {
    icon: FileSignature,
    title: "Digital Signing",
    description: "Sign documents electronically with secure verification.",
    color: "from-purple-500 to-blue-700",
  },
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Get instant support and answers to your questions.",
    color: "from-indigo-500 to-purple-700",
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join our community of developers and tech enthusiasts.",
    color: "from-blue-500 to-indigo-700",
  },
  {
    icon: Code,
    title: "API Integration",
    description: "Access our services programmatically through our API.",
    color: "from-purple-500 to-indigo-700",
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    description: "Track performance and gain insights with detailed analytics.",
    color: "from-indigo-500 to-blue-700",
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Powerful Features for Your Digital Needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Explore our comprehensive suite of tools and services designed to enhance your digital experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br border border-white/10 shadow-lg flex items-center justify-center mb-4">
                    <feature.icon className={`h-6 w-6 text-white`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
