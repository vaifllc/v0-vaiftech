"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProjectType } from "@/lib/types/portfolio"
import { Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface PortfolioFiltersProps {
  onFilterChange: (filters: {
    search: string
    projectType: ProjectType | "all"
    category: string | "all"
    sortBy: "newest" | "oldest" | "featured"
  }) => void
  categories: string[]
}

export function PortfolioFilters({ onFilterChange, categories }: PortfolioFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [search, setSearch] = useState("")
  const [projectType, setProjectType] = useState<ProjectType | "all">("all")
  const [category, setCategory] = useState<string | "all">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "featured">("newest")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ search: e.target.value, projectType, category, sortBy })
  }

  const handleProjectTypeChange = (value: ProjectType | "all") => {
    setProjectType(value)
    onFilterChange({ search, projectType: value, category, sortBy })
  }

  const handleCategoryChange = (value: string | "all") => {
    setCategory(value)
    onFilterChange({ search, projectType, category: value, sortBy })
  }

  const handleSortChange = (value: "newest" | "oldest" | "featured") => {
    setSortBy(value)
    onFilterChange({ search, projectType, category, sortBy: value })
  }

  return (
    <div className="w-full mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10" value={search} onChange={handleSearchChange} />
        </div>
        <Button
          variant="outline"
          className="md:w-auto w-full flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <Select value={sortBy} onValueChange={(value) => handleSortChange(value as any)}>
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <Select value={projectType} onValueChange={(value) => handleProjectTypeChange(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="mobile-app">Mobile App</SelectItem>
              <SelectItem value="pwa">Progressive Web App</SelectItem>
              <SelectItem value="web-app">Web Application</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="branding">Branding</SelectItem>
              <SelectItem value="logo">Logo</SelectItem>
              <SelectItem value="ui-ux">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={(value) => handleCategoryChange(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
