import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/card"
import { CheckCircle, Code, Database, Gauge, Layout, Smartphone, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Web Development Services | VAIF TECH",
  description:
    "Professional web development services including responsive websites, web applications, and progressive web apps.",
}

const technologies = [
  { name: "React", icon: "/placeholder.svg?height=40&width=40&query=react logo" },
  { name: "Next.js", icon: "/placeholder.svg?height=40&width=40&query=nextjs logo" },
  { name: "Vue.js", icon: "/placeholder.svg?height=40&width=40&query=vuejs logo" },
  { name: "Angular", icon: "/placeholder.svg?height=40&width=40&query=angular logo" },
  { name: "Node.js", icon: "/placeholder.svg?height=40&width=40&query=nodejs logo" },
  { name: "TypeScript", icon: "/placeholder.svg?height=40&width=40&query=typescript logo" },
  { name: "MongoDB", icon: "/placeholder.svg?height=40&width=40&query=mongodb logo" },
  { name: "PostgreSQL", icon: "/placeholder.svg?height=40&width=40&query=postgresql logo" },
]

const features = [
  {
    icon: Layout,
    title: "Responsive Design",
    description: "Websites that look and function perfectly on all devices, from desktops to smartphones.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Lightning-fast loading times and smooth user experiences through advanced optimization techniques.",
  },
  {
    icon: Smartphone,
    title: "Progressive Web Apps",
    description: "Web applications that offer native app-like experiences with offline capabilities.",
  },
  {
    icon: Code,
    title: "Clean, Maintainable Code",
    description: "Well-structured code that's easy to maintain and extend as your business grows.",
  },
  {
    icon: Database,
    title: "Database Integration",
    description: "Seamless integration with various database systems to store and manage your data efficiently.",
  },
  {
    icon: Gauge,
    title: "SEO Optimization",
    description: "Built-in search engine optimization to improve your website's visibility in search results.",
  },
]

export default function WebDevelopmentPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold mb-6">Web Development Services</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Custom websites and web applications built with cutting-edge technologies to deliver exceptional user
            experiences and drive business growth.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Responsive Design</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Performance Optimized</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>SEO Friendly</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Scalable Architecture</span>
            </div>
          </div>
          <Link href="/quote-builder?service=web-development">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              Get a Quote
            </Button>
          </Link>
        </div>
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/placeholder.svg?height=600&width=800&query=modern web development process with code and design"
            alt="Web Development"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300"
            >
              <feature.icon className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Technologies We Use</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
          We leverage the latest and most powerful technologies to build robust, scalable, and high-performance web
          solutions.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 mb-2">
                <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} width={64} height={64} />
              </div>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Development Process</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-600"></div>

          {/* Timeline items */}
          <div className="grid grid-cols-1 gap-12">
            {[
              {
                number: 1,
                title: "Discovery & Planning",
                description:
                  "We start by understanding your business goals, target audience, and project requirements.",
              },
              {
                number: 2,
                title: "Design & Prototyping",
                description:
                  "Our designers create wireframes and interactive prototypes to visualize the user experience.",
              },
              {
                number: 3,
                title: "Development",
                description:
                  "Our developers build your website or application using the most appropriate technologies.",
              },
              {
                number: 4,
                title: "Testing & Quality Assurance",
                description: "Rigorous testing ensures your website works flawlessly across all devices and browsers.",
              },
              {
                number: 5,
                title: "Deployment",
                description: "We deploy your website to production and ensure everything is running smoothly.",
              },
              {
                number: 6,
                title: "Maintenance & Support",
                description: "Ongoing support and maintenance to keep your website secure and up-to-date.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`relative flex ${index % 2 === 0 ? "justify-end" : "justify-start"} md:justify-center`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                  <div className="p-6 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-purple-500/10 to-indigo-600/10 p-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Web Project?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's discuss how we can help you achieve your business goals with a custom web solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/quote-builder?service=web-development">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              Get a Quote
            </Button>
          </Link>
          <Link href="/portfolio?category=website">
            <Button variant="outline">View Web Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
