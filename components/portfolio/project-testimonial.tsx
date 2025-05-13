import Image from "next/image"
import { Quote } from "lucide-react"

interface ProjectTestimonialProps {
  quote: string
  author: {
    name: string
    title: string
    company: string
    avatar?: string
  }
}

export function ProjectTestimonial({ quote, author }: ProjectTestimonialProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-6 my-12 relative">
      <Quote className="absolute text-primary/20 w-12 h-12 -top-4 -left-2" />
      <blockquote className="text-lg italic mb-6 pt-2 relative z-10">"{quote}"</blockquote>
      <div className="flex items-center gap-4">
        {author.avatar ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={author.avatar || "/placeholder.svg"} alt={author.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">{author.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold">{author.name}</p>
          <p className="text-sm text-muted-foreground">
            {author.title}, {author.company}
          </p>
        </div>
      </div>
    </div>
  )
}
