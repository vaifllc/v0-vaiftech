"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { portfolioItems } from "@/lib/data/portfolio-data"
import { ArrowLeft, Calendar, Clock, ExternalLink, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"

export default function PortfolioItemPage({ params }: { params: { id: string } }) {
  const project = portfolioItems.find((item) => item.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Link href="/portfolio">
        <Button variant="ghost" className="mb-8 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <p className="text-lg text-muted-foreground mb-8">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="text-lg font-medium">{project.clientName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Project Type</h3>
                <p className="text-lg font-medium capitalize">{project.projectType.replace("-", " ")}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p className="text-lg font-medium">{project.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                  <p className="text-lg font-medium">
                    {new Date(project.completionDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <Badge key={tech.name} variant="outline" className="text-sm py-1 px-3">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {project.images.map((image, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-8">
            {project.url && (
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Visit Project</h3>
                <p className="text-muted-foreground mb-4">
                  Check out the live version of this project to see it in action.
                </p>
                <Link href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            )}

            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Need a Similar Project?</h3>
              <p className="text-muted-foreground mb-4">
                Let us help you bring your vision to life with our expertise in {project.projectType.replace("-", " ")}{" "}
                development.
              </p>
              <Link href="/quote-builder">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                  Get a Quote
                </Button>
              </Link>
            </div>

            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Related Projects</h3>
              <div className="space-y-4">
                {portfolioItems
                  .filter(
                    (item) =>
                      item.id !== project.id &&
                      (item.projectType === project.projectType ||
                        item.categories.some((cat) => project.categories.includes(cat))),
                  )
                  .slice(0, 3)
                  .map((item) => (
                    <Link key={item.id} href={`/portfolio/${item.id}`} className="block group">
                      <div className="flex gap-3 items-center">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.clientName}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
