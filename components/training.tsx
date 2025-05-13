"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, BarChart } from "lucide-react"

// Course data
const courses = [
  {
    id: 1,
    title: "Modern Web Development",
    description: "Learn the latest web development technologies and best practices.",
    duration: "8 weeks",
    level: "Intermediate",
    image: "/web-development-course.png",
    price: 199,
    popular: true,
  },
  {
    id: 2,
    title: "AI & Machine Learning Fundamentals",
    description: "Introduction to AI concepts, machine learning models, and practical applications.",
    duration: "10 weeks",
    level: "Beginner",
    image: "/ai-machine-learning-course.png",
    price: 249,
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native.",
    duration: "6 weeks",
    level: "Intermediate",
    image: "/mobile-app-development.png",
    price: 179,
  },
]

export default function Training() {
  return (
    <section id="training" className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Training Hub
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Enhance your skills with our expert-led courses and educational resources
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 h-full flex flex-col overflow-hidden group">
                <div className="relative">
                  <div className="overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {course.popular && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-600">
                      Popular
                    </Badge>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    >
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.level}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-border/50 pt-4">
                  <div className="font-bold">
                    ${course.price}
                    <span className="text-xs text-muted-foreground font-normal ml-1">USD</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  >
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-card/30 border border-border/50 rounded-xl p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Custom Training for Teams</h3>
              <p className="text-muted-foreground mb-6">
                We offer tailored training programs for teams and organizations. Our expert instructors will create a
                customized curriculum based on your specific needs and goals.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Customized curriculum for your team's needs",
                  "Flexible scheduling options",
                  "Hands-on projects and real-world applications",
                  "Ongoing support and resources",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                Request Custom Training
              </Button>
            </div>
            <div className="relative">
              <img src="/team-training.png" alt="Team Training" className="rounded-lg shadow-lg" />
              <div className="absolute -bottom-4 -right-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" fill="white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Watch Demo</div>
                    <div className="text-xs text-muted-foreground">2:45 min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
