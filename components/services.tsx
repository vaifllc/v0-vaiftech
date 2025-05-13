"use client"

import { motion } from "framer-motion"
import { Code, Database, Cpu, Lightbulb, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Services data
const services = [
  {
    icon: Code,
    title: "Custom Development",
    description: "Tailored software solutions designed to meet your specific business needs and challenges.",
    features: ["Web Applications", "Mobile Apps", "Desktop Software", "API Development"],
    color: "from-blue-500 to-indigo-700",
  },
  {
    icon: Database,
    title: "Digital Products",
    description: "Ready-to-use digital assets and tools to accelerate your projects and workflows.",
    features: ["UI Templates", "Code Libraries", "eBooks & Guides", "Digital Assets"],
    color: "from-purple-500 to-indigo-700",
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description: "Harness the power of artificial intelligence to automate processes and gain insights.",
    features: ["AI Document Generation", "Chatbots", "Data Analysis", "Process Automation"],
    color: "from-indigo-500 to-blue-700",
  },
  {
    icon: Lightbulb,
    title: "Tech Consulting",
    description: "Expert guidance on technology strategy, implementation, and optimization.",
    features: ["Technology Assessment", "Digital Transformation", "Security Audits", "Performance Optimization"],
    color: "from-blue-500 to-purple-700",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Comprehensive digital solutions tailored to your business needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} border border-white/10 shadow-lg flex items-center justify-center mb-4`}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
