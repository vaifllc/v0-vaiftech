import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Code, Globe, Smartphone, ShoppingBag, Palette, Database, Server, BarChart } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Services | VAIF TECH",
  description:
    "Explore our comprehensive range of digital services including web development, mobile apps, e-commerce solutions, and more.",
}

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom websites built with the latest technologies to deliver exceptional user experiences.",
    link: "/services/web-development",
    image: "/placeholder.svg?key=ec8cz",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android devices.",
    link: "/services/mobile-development",
    image: "/placeholder.svg?key=g06k7",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Solutions",
    description: "Powerful online stores with secure payment processing and inventory management.",
    link: "/services/ecommerce",
    image: "/placeholder.svg?key=bjdgh",
  },
  {
    icon: Code,
    title: "Custom Software Development",
    description: "Tailored software solutions designed to address your specific business challenges.",
    link: "/services/custom-software",
    image: "/placeholder.svg?key=chruk",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that enhances usability and creates memorable brand experiences.",
    link: "/services/ui-ux-design",
    image: "/placeholder.svg?height=300&width=600&query=ui ux design wireframes and prototypes",
  },
  {
    icon: Database,
    title: "Database Solutions",
    description: "Efficient database design, migration, and optimization services.",
    link: "/services/database-solutions",
    image: "/placeholder.svg?height=300&width=600&query=database architecture and management",
  },
  {
    icon: Server,
    title: "Cloud Services",
    description: "Scalable cloud infrastructure setup, migration, and management.",
    link: "/services/cloud-services",
    image: "/placeholder.svg?height=300&width=600&query=cloud computing services and infrastructure",
  },
  {
    icon: BarChart,
    title: "Digital Marketing",
    description: "Strategic digital marketing services to grow your online presence and reach.",
    link: "/services/digital-marketing",
    image: "/placeholder.svg?height=300&width=600&query=digital marketing analytics and strategy",
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground">Comprehensive digital solutions tailored to your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={service.link}>
                <Button variant="ghost" className="group">
                  Learn more
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Not Sure What You Need?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Our team can help you identify the right solutions for your business. Schedule a free consultation to discuss
          your project.
        </p>
        <Link href="/quote-builder">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            Get a Custom Quote
          </Button>
        </Link>
      </div>
    </div>
  )
}
