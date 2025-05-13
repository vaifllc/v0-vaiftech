"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import type { PortfolioItem } from "@/lib/types/portfolio"
import { portfolioData } from "@/lib/data/portfolio-data"
import { Badge } from "@/components/ui/badge"
import { ProjectTypeIcon } from "./project-card"

interface RelatedProjectsProps {
  currentProjectId: string
  projectType: string
  limit?: number
}

export function RelatedProjects({ currentProjectId, projectType, limit = 3 }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<PortfolioItem[]>([])

  useEffect(() => {
    // Find related projects with the same type, excluding the current project
    const related = portfolioData
      .filter((project) => project.id !== currentProjectId && project.type === projectType)
      .slice(0, limit)

    setRelatedProjects(related)
  }, [currentProjectId, projectType, limit])

  if (relatedProjects.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Related Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project) => (
          <Link href={`/portfolio/${project.id}`} key={project.id} className="group">
            <div className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-video">
                <Image
                  src={project.thumbnail || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <ProjectTypeIcon type={project.type} />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
