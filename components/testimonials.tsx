"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

// Testimonial data
const testimonials = [
  {
    id: 1,
    content:
      "VAIF TECH transformed our business with their AI document generator. We've reduced document creation time by 75% and improved accuracy significantly.",
    author: "Sarah Johnson",
    role: "Operations Director",
    company: "TechGrowth Inc.",
    avatar: "/woman-portrait.png",
  },
  {
    id: 2,
    content:
      "The custom development services provided by VAIF TECH exceeded our expectations. Their team delivered a solution that perfectly addressed our unique business challenges.",
    author: "Michael Chen",
    role: "CTO",
    company: "Innovate Solutions",
    avatar: "/thoughtful-man-portrait.png",
  },
  {
    id: 3,
    content:
      "We've been using VAIF TECH's digital products for over a year now. The quality and support are outstanding, and they've helped us streamline our development process.",
    author: "Emily Rodriguez",
    role: "Product Manager",
    company: "Digital Ventures",
    avatar: "/woman-portrait-2.png",
  },
  {
    id: 4,
    content:
      "The training courses from VAIF TECH have been instrumental in upskilling our development team. The content is current, practical, and immediately applicable.",
    author: "David Wilson",
    role: "HR Director",
    company: "Global Systems",
    avatar: "/thoughtful-man-portrait.png",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Hear from businesses that have transformed their digital experience with VAIF TECH
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="text-lg mb-6">{testimonial.content}</p>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">4.9/5</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < 5 ? "text-yellow-500" : "text-muted"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span>based on 200+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
