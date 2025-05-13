import type { PortfolioItem } from "@/lib/types/portfolio"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, ExternalLink, Globe, Smartphone, ShoppingBag, Layout, Palette } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: PortfolioItem
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getProjectTypeIcon = () => {
    switch (project.projectType) {
      case "website":
        return <Globe className="h-4 w-4" />
      case "mobile-app":
        return <Smartphone className="h-4 w-4" />
      case "pwa":
        return <Smartphone className="h-4 w-4" />
      case "shopify":
        return <ShoppingBag className="h-4 w-4" />
      case "ecommerce":
        return <ShoppingBag className="h-4 w-4" />
      case "web-app":
        return <Layout className="h-4 w-4" />
      case "branding":
      case "logo":
      case "ui-ux":
        return <Palette className="h-4 w-4" />
      default:
        return <Layout className="h-4 w-4" />
    }
  }

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={project.images[0] || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {project.featured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getProjectTypeIcon()}
            <span className="capitalize">{project.projectType.replace("-", " ")}</span>
          </Badge>
        </div>
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Client:</span>
            <span className="text-muted-foreground">{project.clientName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{project.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date(project.completionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech.name} variant="secondary" className="text-xs">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap gap-2">
            {project.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {project.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.categories.length - 2}
              </Badge>
            )}
          </div>
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-1 text-primary hover:underline"
            >
              Visit
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
