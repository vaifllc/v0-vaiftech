"use client"

import { ProjectCard } from "@/components/portfolio/project-card"
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters"
import { portfolioItems } from "@/lib/data/portfolio-data"
import type { PortfolioItem, ProjectType } from "@/lib/types/portfolio"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function PortfolioPage() {
  const [filteredProjects, setFilteredProjects] = useState<PortfolioItem[]>(portfolioItems)
  const [filters, setFilters] = useState({
    search: "",
    projectType: "all" as ProjectType | "all",
    category: "all" as string | "all",
    sortBy: "newest" as "newest" | "oldest" | "featured",
  })

  // Extract all unique categories from portfolio items
  const allCategories = Array.from(new Set(portfolioItems.flatMap((item) => item.categories))).sort()

  useEffect(() => {
    let result = [...portfolioItems]

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.clientName.toLowerCase().includes(searchTerm) ||
          project.categories.some((cat) => cat.toLowerCase().includes(searchTerm)),
      )
    }

    // Filter by project type
    if (filters.projectType !== "all") {
      result = result.filter((project) => project.projectType === filters.projectType)
    }

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((project) => project.categories.includes(filters.category))
    }

    // Sort projects
    if (filters.sortBy === "newest") {
      result = result.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime())
    } else if (filters.sortBy === "oldest") {
      result = result.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime())
    } else if (filters.sortBy === "featured") {
      result = result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    }

    setFilteredProjects(result)
  }, [filters])

  const handleFilterChange = (newFilters: {
    search: string
    projectType: ProjectType | "all"
    category: string | "all"
    sortBy: "newest" | "oldest" | "featured"
  }) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse collection of projects spanning websites, mobile apps, branding, and more.
        </p>
      </motion.div>

      <PortfolioFilters onFilterChange={handleFilterChange} categories={allCategories} />

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
