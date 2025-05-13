"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Minus } from "lucide-react"

interface ComparisonButtonProps {
  isSelected: boolean
  onToggle: () => void
}

export function ComparisonButton({ isSelected, onToggle }: ComparisonButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isSelected ? "default" : "outline"}
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault()
              onToggle()
            }}
          >
            {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isSelected ? "Remove from comparison" : "Add to comparison"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
