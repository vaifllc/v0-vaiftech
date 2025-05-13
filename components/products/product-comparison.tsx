"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X, ChevronDown, ChevronUp, BarChart2, Printer, Download, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductComparisonProps {
  products: any[]
  onClose: () => void
  onRemoveProduct: (productId: string) => void
  onClearAll: () => void
}

export function ProductComparison({ products, onClose, onRemoveProduct, onClearAll }: ProductComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Comparison fields
  const comparisonSections = [
    {
      title: "Basic Information",
      fields: [
        { id: "price", label: "Price", type: "price" },
        { id: "rating", label: "Rating", type: "rating" },
        { id: "level", label: "Experience Level", type: "text" },
        { id: "framework", label: "Framework", type: "text" },
        { id: "category", label: "Category", type: "text" },
        { id: "lastUpdated", label: "Last Updated", type: "date" },
      ],
    },
    {
      title: "Features",
      fields: [
        { id: "features", label: "Features", type: "list" },
        { id: "tags", label: "Tags", type: "tags" },
      ],
    },
    {
      title: "Technical Specifications",
      fields: [
        { id: "specs.pages", label: "Pages", type: "number" },
        { id: "specs.components", label: "Components", type: "number" },
        { id: "specs.responsive", label: "Responsive", type: "boolean" },
        { id: "specs.darkMode", label: "Dark Mode", type: "boolean" },
        { id: "specs.rtlSupport", label: "RTL Support", type: "boolean" },
        { id: "specs.updates", label: "Updates", type: "text" },
        { id: "specs.support", label: "Support", type: "text" },
        { id: "specs.documentation", label: "Documentation", type: "text" },
        { id: "specs.license", label: "License", type: "text" },
      ],
    },
  ]

  // Get nested field value
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined
    }, obj)
  }

  // Get field value for comparison
  const getFieldValue = (product: any, field: any) => {
    const value = field.id.includes(".") ? getNestedValue(product, field.id) : product[field.id]

    switch (field.type) {
      case "price":
        return `$${product.price}`
      case "rating":
        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center mr-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < product.rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-muted-foreground",
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span>{product.rating}</span>
          </div>
        )
      case "date":
        return formatDate(value)
      case "list":
        return value ? (
          <ul className="list-disc list-inside text-sm text-left">
            {value.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          "-"
        )
      case "tags":
        return value ? (
          <div className="flex flex-wrap justify-center gap-1">
            {value.map((tag: string) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          "-"
        )
      case "boolean":
        return value === true ? (
          <Check className="h-5 w-5 text-green-500 mx-auto" />
        ) : value === false ? (
          <X className="h-5 w-5 text-red-500 mx-auto" />
        ) : (
          "-"
        )
      case "number":
        return value !== undefined ? value : "-"
      default:
        return value || "-"
    }
  }

  // Highlight the best value
  const highlightBest = (field: any, products: any[]) => {
    if (products.length <= 1) return {}

    // Only highlight certain fields
    const highlightableFields = ["price", "rating", "specs.components", "specs.pages"]
    if (!highlightableFields.includes(field.id)) return {}

    const values = products.map((product) => {
      const value = field.id.includes(".")
        ? getNestedValue(product, field.id)
        : product[field.id]
      return { id: product.id, value }
    })

    // Skip if any product is missing this value
    if (values.some((v) => v.value === undefined || v.value === null)) return {}

    // For price, lower is better
    if (field.id === "price") {
      const minPrice = Math.min(...values.map((v) => v.value))
      return values.reduce((acc, v) => {
        if (v.value === minPrice) acc[v.id] = true
        return acc
      }, {} as Record<string, boolean>)
    }

    // For others, higher is better
    const maxValue = Math.max(...values.map((v) => v.value))
    return values.reduce((acc, v) => {
      if (v.value === maxValue) acc[v.id] = true
      return acc
    }, {} as Record<string, boolean>)
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-40 transition-all duration-300",
        isExpanded ? "h-[80vh]" : "h-auto",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">
              Comparing {products.length} {products.length === 1 ? "Product" : "Products"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8">
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 rounded-full"
            >
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className  size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className={cn("py-4", isExpanded ? "h-[calc(80vh-4rem)]" : "max-h-[calc(50vh-4rem)]")}>
          <div className="space-y-8">
            {/* Product headers */}
            <div className="flex">
              <div className="w-[200px] flex-shrink-0"></div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col items-center text-center">
                    <div className="relative h-24 w-24 mb-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h4 className="font-medium text-base mb-1">{product.title}</h4>
                    <div className="text-primary font-bold text-xl mb-2">${product.price}</div>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="h-8">
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison sections */}
            {comparisonSections.map((section) => (
              <div key={section.title} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 font-medium">{section.title}</div>
                <Table>
                  <TableBody>
                    {section.fields.map((field) => {
                      const bestValues = highlightBest(field, products)
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium w-[200px]">{field.label}</TableCell>
                          <TableCell className="p-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
                              {products.map((product) => (
                                <div
                                  key={`${product.id}-${field.id}`}
                                  className={cn(
                                    "p-4",
                                    bestValues[product.id] && "bg-primary/5 font-medium",
                                  )}
                                >
                                  {getFieldValue(product, field)}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
