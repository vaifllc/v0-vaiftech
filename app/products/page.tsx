"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ShoppingCart,
  Code,
  FileText,
  Palette,
  Search,
  X,
  Star,
  Clock,
  Filter,
  BarChart2,
  Check,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Product categories
const categories = [
  { id: "all", label: "All Products" },
  { id: "digital", label: "Digital Products" },
  { id: "source-code", label: "Source Code" },
  { id: "ebooks", label: "eBooks" },
  { id: "templates", label: "Templates" },
]

// Sample products with additional metadata
const productsData = [
  {
    id: "admin-dashboard",
    title: "Admin Dashboard Template",
    description: "A fully responsive admin dashboard template built with React, Next.js, and Tailwind CSS.",
    price: 49,
    category: "digital",
    image: "/placeholder.svg?key=dqhvt",
    badge: "Bestseller",
    demo: "#",
    rating: 4.8,
    reviews: 124,
    dateAdded: "2023-09-15",
    tags: ["react", "nextjs", "dashboard", "admin", "tailwind"],
    features: ["Responsive design", "Dark/light mode", "10+ page templates", "Chart components"],
    level: "intermediate",
    framework: "react",
    compatibility: ["Next.js", "React", "Vite"],
    lastUpdated: "2023-12-10",
    sales: 1240,
    specs: {
      pages: 15,
      components: 50,
      responsive: true,
      darkMode: true,
      rtlSupport: true,
      updates: "Lifetime",
      support: "6 months",
      documentation: "Comprehensive",
      license: "Standard",
    },
  },
  {
    id: "ecommerce-template",
    title: "E-Commerce Starter Kit",
    description: "Complete e-commerce solution with product management, cart, and checkout functionality.",
    price: 79,
    category: "source-code",
    image: "/placeholder.svg?key=mwgj0",
    badge: "New",
    demo: "#",
    rating: 4.6,
    reviews: 86,
    dateAdded: "2024-01-20",
    tags: ["ecommerce", "nextjs", "stripe", "shopping cart"],
    features: ["Product management", "Shopping cart", "Checkout", "Payment integration"],
    level: "advanced",
    framework: "nextjs",
    compatibility: ["Next.js 14+"],
    lastUpdated: "2024-02-15",
    sales: 560,
    specs: {
      pages: 25,
      components: 80,
      responsive: true,
      darkMode: true,
      rtlSupport: false,
      updates: "1 year",
      support: "1 year",
      documentation: "Comprehensive",
      license: "Extended",
    },
  },
  {
    id: "nextjs-blog",
    title: "Next.js Blog Template",
    description: "A beautiful blog template built with Next.js, MDX, and Tailwind CSS.",
    price: 29,
    category: "source-code",
    image: "/blog-website.png",
    demo: "#",
    rating: 4.5,
    reviews: 52,
    dateAdded: "2023-11-05",
    tags: ["blog", "nextjs", "mdx", "content"],
    features: ["MDX support", "Code syntax highlighting", "SEO optimized", "RSS feed"],
    level: "beginner",
    framework: "nextjs",
    compatibility: ["Next.js 13+", "Next.js 14+"],
    lastUpdated: "2024-01-10",
    sales: 420,
    specs: {
      pages: 10,
      components: 30,
      responsive: true,
      darkMode: true,
      rtlSupport: false,
      updates: "6 months",
      support: "3 months",
      documentation: "Basic",
      license: "Standard",
    },
  },
  {
    id: "react-hooks-guide",
    title: "Mastering React Hooks",
    description: "Comprehensive guide to React Hooks with practical examples and best practices.",
    price: 19,
    category: "ebooks",
    image: "/placeholder.svg?key=w9ut8",
    rating: 4.9,
    reviews: 215,
    dateAdded: "2023-08-12",
    tags: ["react", "hooks", "javascript", "frontend"],
    features: ["200+ pages", "Code examples", "Best practices", "Performance tips"],
    level: "intermediate",
    framework: "react",
    lastUpdated: "2023-12-05",
    sales: 1850,
    specs: {
      pages: 200,
      format: "PDF, EPUB, MOBI",
      codeExamples: true,
      exercises: true,
      updates: "Lifetime",
      support: "None",
      license: "Single user",
    },
  },
  {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass",
    description: "Learn to build production-ready applications with Next.js from scratch.",
    price: 24,
    category: "ebooks",
    image: "/placeholder.svg?key=8z2nf",
    badge: "Popular",
    rating: 4.7,
    reviews: 178,
    dateAdded: "2023-10-18",
    tags: ["nextjs", "react", "fullstack", "serverless"],
    features: ["250+ pages", "Project-based learning", "Server components", "API routes"],
    level: "advanced",
    framework: "nextjs",
    lastUpdated: "2024-01-25",
    sales: 1560,
    specs: {
      pages: 250,
      format: "PDF, EPUB",
      codeExamples: true,
      exercises: true,
      updates: "1 year",
      support: "Email support",
      license: "Single user",
    },
  },
  {
    id: "ui-components",
    title: "UI Component Library",
    description: "Collection of 50+ reusable UI components built with React and Tailwind CSS.",
    price: 39,
    category: "digital",
    image: "/placeholder.svg?key=w5j57",
    demo: "#",
    rating: 4.6,
    reviews: 92,
    dateAdded: "2023-09-30",
    tags: ["ui", "components", "react", "tailwind"],
    features: ["50+ components", "Fully customizable", "Accessibility", "Dark mode support"],
    level: "intermediate",
    framework: "react",
    compatibility: ["React 18+", "Tailwind CSS 3+"],
    lastUpdated: "2024-02-01",
    sales: 780,
    specs: {
      components: 50,
      responsive: true,
      darkMode: true,
      rtlSupport: true,
      updates: "1 year",
      support: "6 months",
      documentation: "Comprehensive",
      license: "Standard",
    },
  },
  {
    id: "logo-templates",
    title: "Premium Logo Templates",
    description: "Collection of 20 premium logo templates in various styles and formats.",
    price: 29,
    category: "templates",
    image: "/placeholder.svg?key=8ju5y",
    rating: 4.4,
    reviews: 68,
    dateAdded: "2023-11-15",
    tags: ["logo", "branding", "design", "templates"],
    features: ["20 templates", "AI & PSD files", "Commercial license", "Free updates"],
    level: "beginner",
    lastUpdated: "2024-01-05",
    sales: 420,
    specs: {
      templates: 20,
      formats: "AI, PSD, SVG, PNG",
      customizable: true,
      commercial: true,
      updates: "6 months",
      support: "Basic",
      license: "Commercial",
    },
  },
  {
    id: "social-media-kit",
    title: "Social Media Design Kit",
    description: "Complete design kit for social media posts, stories, and profiles.",
    price: 34,
    category: "templates",
    image: "/placeholder.svg?key=0a90v",
    badge: "New",
    rating: 4.7,
    reviews: 42,
    dateAdded: "2024-02-10",
    tags: ["social media", "instagram", "facebook", "design"],
    features: ["100+ templates", "Canva & Photoshop files", "Customizable", "Size optimized"],
    level: "beginner",
    lastUpdated: "2024-02-10",
    sales: 210,
    specs: {
      templates: 100,
      formats: "PSD, Canva",
      platforms: "Instagram, Facebook, Twitter, LinkedIn",
      customizable: true,
      updates: "3 months",
      support: "Basic",
      license: "Standard",
    },
  },
  {
    id: "portfolio-template",
    title: "Developer Portfolio Template",
    description: "Professional portfolio template for developers and designers.",
    price: 19,
    category: "source-code",
    image: "/placeholder.svg?key=wq40z",
    rating: 4.5,
    reviews: 37,
    dateAdded: "2023-12-05",
    tags: ["portfolio", "developer", "designer", "personal"],
    features: ["Project showcase", "Skills section", "Contact form", "Blog integration"],
    level: "beginner",
    framework: "react",
    compatibility: ["React", "Next.js"],
    lastUpdated: "2024-01-15",
    sales: 320,
    specs: {
      pages: 5,
      components: 20,
      responsive: true,
      darkMode: true,
      rtlSupport: false,
      updates: "6 months",
      support: "3 months",
      documentation: "Basic",
      license: "Standard",
    },
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Comprehensive analytics dashboard with charts, tables, and data visualization.",
    price: 59,
    category: "digital",
    image: "/placeholder.svg?key=hvchu",
    rating: 4.8,
    reviews: 56,
    dateAdded: "2024-01-05",
    tags: ["analytics", "dashboard", "charts", "data"],
    features: ["Real-time updates", "Multiple chart types", "Data export", "Customizable widgets"],
    level: "advanced",
    framework: "react",
    compatibility: ["React", "Next.js", "Vue"],
    lastUpdated: "2024-02-20",
    sales: 380,
    specs: {
      pages: 12,
      components: 45,
      responsive: true,
      darkMode: true,
      rtlSupport: true,
      updates: "1 year",
      support: "1 year",
      documentation: "Comprehensive",
      license: "Extended",
    },
  },
  {
    id: "ai-development-guide",
    title: "AI Development Guide",
    description: "Comprehensive guide to building AI-powered applications.",
    price: 29,
    category: "ebooks",
    image: "/placeholder.svg?key=na9l5",
    badge: "Trending",
    rating: 4.9,
    reviews: 83,
    dateAdded: "2024-02-01",
    tags: ["ai", "machine learning", "development", "guide"],
    features: ["300+ pages", "Code examples", "Case studies", "Best practices"],
    level: "advanced",
    lastUpdated: "2024-02-25",
    sales: 410,
    specs: {
      pages: 300,
      format: "PDF, EPUB, MOBI",
      codeExamples: true,
      exercises: true,
      updates: "1 year",
      support: "Email support",
      license: "Single user",
    },
  },
  {
    id: "landing-page-templates",
    title: "SaaS Landing Page Templates",
    description: "Collection of high-converting landing page templates for SaaS products.",
    price: 39,
    category: "templates",
    image: "/placeholder.svg?height=300&width=600&query=saas landing page with features section",
    rating: 4.6,
    reviews: 47,
    dateAdded: "2023-10-25",
    tags: ["landing page", "saas", "conversion", "marketing"],
    features: ["10 templates", "A/B testing ready", "Mobile optimized", "Easy customization"],
    level: "intermediate",
    lastUpdated: "2024-01-20",
    sales: 290,
    specs: {
      templates: 10,
      formats: "HTML, Figma, Webflow",
      responsive: true,
      customizable: true,
      updates: "6 months",
      support: "Basic",
      license: "Standard",
    },
  },
]

// Frameworks
const frameworks = [
  { id: "all", label: "All Frameworks" },
  { id: "react", label: "React" },
  { id: "nextjs", label: "Next.js" },
  { id: "vue", label: "Vue.js" },
  { id: "angular", label: "Angular" },
]

// Experience levels
const levels = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
]

// Comparison fields
const comparisonFields = [
  { id: "price", label: "Price", type: "price" },
  { id: "rating", label: "Rating", type: "rating" },
  { id: "level", label: "Level", type: "text" },
  { id: "framework", label: "Framework", type: "text" },
  { id: "lastUpdated", label: "Last Updated", type: "date" },
  { id: "features", label: "Features", type: "list" },
]

// Spec comparison fields
const specComparisonFields = [
  { id: "pages", label: "Pages", type: "number" },
  { id: "components", label: "Components", type: "number" },
  { id: "responsive", label: "Responsive", type: "boolean" },
  { id: "darkMode", label: "Dark Mode", type: "boolean" },
  { id: "rtlSupport", label: "RTL Support", type: "boolean" },
  { id: "updates", label: "Updates", type: "text" },
  { id: "support", label: "Support", type: "text" },
  { id: "documentation", label: "Documentation", type: "text" },
  { id: "license", label: "License", type: "text" },
]

export default function ProductsPage() {
  // State for active category tab
  const [activeCategory, setActiveCategory] = useState("all")

  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // State for price range
  const [priceRange, setPriceRange] = useState([0, 100])

  // State for selected frameworks
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])

  // State for selected levels
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  // State for sort option
  const [sortOption, setSortOption] = useState("featured")

  // State for mobile filter visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState(productsData)

  // State for active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // State for comparison products
  const [comparisonProducts, setComparisonProducts] = useState<string[]>([])

  // State for comparison drawer visibility
  const [showComparison, setShowComparison] = useState(false)

  // Filter products based on all criteria
  useEffect(() => {
    let filtered = productsData.filter((product) => {
      // Filter by category
      if (activeCategory !== "all" && product.category !== activeCategory) {
        return false
      }

      // Filter by search query
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Filter by framework
      if (
        selectedFrameworks.length > 0 &&
        !selectedFrameworks.includes("all") &&
        (!product.framework || !selectedFrameworks.includes(product.framework))
      ) {
        return false
      }

      // Filter by level
      if (
        selectedLevels.length > 0 &&
        !selectedLevels.includes("all") &&
        (!product.level || !selectedLevels.includes(product.level))
      ) {
        return false
      }

      return true
    })

    // Sort products
    filtered = sortProducts(filtered, sortOption)

    setFilteredProducts(filtered)

    // Count active filters
    let count = 0
    if (searchQuery) count++
    if (priceRange[0] > 0 || priceRange[1] < 100) count++
    if (selectedFrameworks.length > 0 && !selectedFrameworks.includes("all")) count++
    if (selectedLevels.length > 0 && !selectedLevels.includes("all")) count++
    setActiveFiltersCount(count)
  }, [activeCategory, searchQuery, priceRange, selectedFrameworks, selectedLevels, sortOption])

  // Sort products based on selected option
  const sortProducts = (products: typeof productsData, option: string) => {
    switch (option) {
      case "newest":
        return [...products].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price)
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating)
      case "popular":
        return [...products].sort((a, b) => b.sales - a.sales)
      default:
        return products // Featured is the default order
    }
  }

  // Toggle framework selection
  const toggleFramework = (frameworkId: string) => {
    if (frameworkId === "all") {
      setSelectedFrameworks(selectedFrameworks.includes("all") ? [] : ["all"])
    } else {
      setSelectedFrameworks(
        selectedFrameworks.includes(frameworkId)
          ? selectedFrameworks.filter((id) => id !== frameworkId && id !== "all")
          : [...selectedFrameworks.filter((id) => id !== "all"), frameworkId],
      )
    }
  }

  // Toggle level selection
  const toggleLevel = (levelId: string) => {
    if (levelId === "all") {
      setSelectedLevels(selectedLevels.includes("all") ? [] : ["all"])
    } else {
      setSelectedLevels(
        selectedLevels.includes(levelId)
          ? selectedLevels.filter((id) => id !== levelId && id !== "all")
          : [...selectedLevels.filter((id) => id !== "all"), levelId],
      )
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 100])
    setSelectedFrameworks([])
    setSelectedLevels([])
    setSortOption("featured")
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "digital":
        return <Code className="h-4 w-4 mr-2 text-muted-foreground" />
      case "source-code":
        return <Code className="h-4 w-4 mr-2 text-muted-foreground" />
      case "ebooks":
        return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
      case "templates":
        return <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
      default:
        return null
    }
  }

  // Toggle product in comparison
  const toggleProductComparison = (productId: string) => {
    if (comparisonProducts.includes(productId)) {
      setComparisonProducts(comparisonProducts.filter((id) => id !== productId))
      if (comparisonProducts.length <= 1) {
        setShowComparison(false)
      }
    } else {
      if (comparisonProducts.length >= 4) {
        // Limit to 4 products for comparison
        alert("You can compare up to 4 products at a time.")
        return
      }
      setComparisonProducts([...comparisonProducts, productId])
      if (comparisonProducts.length > 0) {
        setShowComparison(true)
      }
    }
  }

  // Clear all products from comparison
  const clearComparison = () => {
    setComparisonProducts([])
    setShowComparison(false)
  }

  // Get comparison products data
  const getComparisonProductsData = () => {
    return productsData.filter((product) => comparisonProducts.includes(product.id))
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get field value for comparison
  const getFieldValue = (product: any, field: any) => {
    switch (field.type) {
      case "price":
        return `$${product[field.id]}`
      case "rating":
        return (
          <div className="flex items-center">
            <div className="flex items-center mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product[field.id])
                      ? "text-yellow-400 fill-yellow-400"
                      : i < product[field.id]
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
            <span>{product[field.id]}</span>
          </div>
        )
      case "date":
        return formatDate(product[field.id])
      case "list":
        return (
          <ul className="list-disc list-inside text-sm">
            {product[field.id]?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )
      case "boolean":
        return product.specs && product.specs[field.id] ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )
      case "number":
        return product.specs && product.specs[field.id] ? product.specs[field.id] : "-"
      default:
        return product[field.id] || product.specs?.[field.id] || "-"
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Digital Products</h1>
        <p className="text-xl text-muted-foreground">
          Browse our collection of premium digital products, source code, eBooks, and design templates
        </p>
      </div>

      {/* Main content with filters and products */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                  <X className="h-4 w-4 mr-1" /> Clear all
                </Button>
              )}
            </div>

            {/* Search */}
            <div>
              <h3 className="text-sm font-medium mb-2">Search</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2.5">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Price Range</h3>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[0, 100]}
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={100}
                step={5}
                className="my-6"
              />
            </div>

            {/* Frameworks */}
            <Accordion type="single" collapsible defaultValue="frameworks">
              <AccordionItem value="frameworks" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium">Frameworks</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {frameworks.map((framework) => (
                      <div key={framework.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`framework-${framework.id}`}
                          checked={selectedFrameworks.includes(framework.id)}
                          onCheckedChange={() => toggleFramework(framework.id)}
                        />
                        <label
                          htmlFor={`framework-${framework.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {framework.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Experience Level */}
            <Accordion type="single" collapsible defaultValue="levels">
              <AccordionItem value="levels" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium">Experience Level</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level.id}`}
                          checked={selectedLevels.includes(level.id)}
                          onCheckedChange={() => toggleLevel(level.id)}
                        />
                        <label
                          htmlFor={`level-${level.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Mobile filters and sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-2 sm:flex-1">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowMobileFilters(true)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 lg:hidden"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2.5 lg:hidden">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">{filteredProducts.length} products</div>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {(priceRange[0] > 0 || priceRange[1] < 100) && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 100])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {selectedFrameworks.length > 0 && !selectedFrameworks.includes("all") && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Frameworks: {selectedFrameworks.length}
                  <button onClick={() => setSelectedFrameworks([])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {selectedLevels.length > 0 && !selectedLevels.includes("all") && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Levels: {selectedLevels.length}
                  <button onClick={() => setSelectedLevels([])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2">
                Clear all
              </Button>
            </div>
          )}

          {/* Compare button */}
          {comparisonProducts.length > 0 && (
            <div className="mb-6 flex justify-between items-center bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">
                  {comparisonProducts.length} {comparisonProducts.length === 1 ? "product" : "products"} selected for
                  comparison
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-xs h-8"
                >
                  {showComparison ? "Hide Comparison" : "Compare Products"}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearComparison} className="text-xs h-8">
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Product grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={cn(
                    "overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full",
                    comparisonProducts.includes(product.id) && "ring-2 ring-primary",
                  )}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {product.badge && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                    {/* Compare button */}
                    <div className="absolute top-2 left-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={comparisonProducts.includes(product.id) ? "default" : "outline"}
                              size="icon"
                              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleProductComparison(product.id)
                              }}
                            >
                              {comparisonProducts.includes(product.id) ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {comparisonProducts.includes(product.id) ? "Remove from comparison" : "Add to comparison"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base mb-4 line-clamp-3">{product.description}</CardDescription>

                    {/* Product metadata */}
                    <div className="space-y-3 mb-4">
                      {/* Rating */}
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : i < product.rating
                                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                                    : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm ml-2">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      {/* Last updated */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Updated {new Date(product.lastUpdated).toLocaleDateString()}
                      </div>

                      {/* Tags */}
                      {product.tags && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">${product.price}</div>
                      <div className="flex items-center">
                        {getCategoryIcon(product.category)}
                        <span className="text-sm text-muted-foreground capitalize">
                          {product.category.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="default" className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    {product.demo && (
                      <Button variant="outline" asChild>
                        <Link href={product.demo}>Demo</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={100} step={5} className="my-6" />
              </div>

              {/* Frameworks */}
              <div>
                <h3 className="text-sm font-medium mb-3">Frameworks</h3>
                <div className="space-y-2">
                  {frameworks.map((framework) => (
                    <div key={framework.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-framework-${framework.id}`}
                        checked={selectedFrameworks.includes(framework.id)}
                        onCheckedChange={() => toggleFramework(framework.id)}
                      />
                      <label
                        htmlFor={`mobile-framework-${framework.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {framework.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h3 className="text-sm font-medium mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-level-${level.id}`}
                        checked={selectedLevels.includes(level.id)}
                        onCheckedChange={() => toggleLevel(level.id)}
                      />
                      <label
                        htmlFor={`mobile-level-${level.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {level.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="default" className="flex-1" onClick={() => setShowMobileFilters(false)}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison drawer */}
      {showComparison && comparisonProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-40 transition-transform duration-300">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Product Comparison</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearComparison} className="h-8">
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComparison(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(50vh-2rem)] py-4">
              <div className="space-y-6">
                {/* Basic comparison */}
                <div>
                  <h4 className="font-medium mb-4">Product Details</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Feature</TableHead>
                        {getComparisonProductsData().map((product) => (
                          <TableHead key={product.id} className="min-w-[200px]">
                            <div className="flex flex-col items-center">
                              <div className="relative h-16 w-16 mb-2">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="text-center font-medium">{product.title}</div>
                              <div className="text-primary font-bold">${product.price}</div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProductComparison(product.id)}
                                className="mt-1 h-7 text-xs"
                              >
                                Remove
                              </Button>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonFields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.label}</TableCell>
                          {getComparisonProductsData().map((product) => (
                            <TableCell key={`${product.id}-${field.id}`} className="text-center">
                              {getFieldValue(product, field)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Technical specifications */}
                <div>
                  <h4 className="font-medium mb-4">Technical Specifications</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Specification</TableHead>
                        {getComparisonProductsData().map((product) => (
                          <TableHead key={`spec-${product.id}`} className="min-w-[200px] text-center">
                            {product.title}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specComparisonFields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.label}</TableCell>
                          {getComparisonProductsData().map((product) => (
                            <TableCell key={`${product.id}-${field.id}`} className="text-center">
                              {getFieldValue(product, field)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Comparison floating button (mobile) */}
      {comparisonProducts.length > 0 && !showComparison && (
        <div className="fixed bottom-4 right-4 z-40 lg:hidden">
          <Button
            onClick={() => setShowComparison(true)}
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
          >
            <div className="flex flex-col items-center justify-center">
              <BarChart2 className="h-6 w-6" />
              <span className="text-xs mt-1">{comparisonProducts.length}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Custom Product Request */}
      <div className="mt-20 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 p-12 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Custom Product?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Don't see what you're looking for? We can create custom digital products tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote-builder">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              >
                Request Custom Product
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
