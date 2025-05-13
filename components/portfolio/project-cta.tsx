import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProjectCTAProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

export function ProjectCTA({
  title = "Need a similar project?",
  description = "Let's discuss how we can help you achieve your business goals with a custom solution.",
  buttonText = "Get a Quote",
  buttonLink = "/quote-builder",
}: ProjectCTAProps) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button asChild className="w-full">
        <Link href={buttonLink}>{buttonText}</Link>
      </Button>
    </div>
  )
}
