"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ProjectGalleryProps {
  images: {
    url: string
    alt: string
    caption?: string
  }[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Project Gallery</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(index)}
              >
                <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                    {image.caption}
                  </div>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw]">
              <div className="relative aspect-video w-full">
                <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-contain" />
              </div>
              {image.caption && <p className="text-center text-muted-foreground mt-2">{image.caption}</p>}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
