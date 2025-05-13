import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, Star, Calendar, FileText, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Training & Resources | VAIF TECH",
  description:
    "Enhance your skills with our comprehensive training courses, workshops, and resources in web development, mobile app development, AI, and more.",
}

// Sample courses
const courses = [
  {
    id: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites from scratch.",
    image: "/placeholder.svg?height=300&width=600&query=web development html css javascript course",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1245,
    link: "/training/web-development-fundamentals",
    tags: ["HTML", "CSS", "JavaScript"],
    type: "course",
  },
  {
    id: "react-masterclass",
    title: "React.js Masterclass",
    description:
      "Master React.js and build modern, interactive web applications with the most popular JavaScript library.",
    image: "/placeholder.svg?height=300&width=600&query=react javascript framework course",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: 987,
    link: "/training/react-masterclass",
    tags: ["React", "JavaScript", "Frontend"],
    type: "course",
  },
  {
    id: "fullstack-nextjs",
    title: "Full-Stack Development with Next.js",
    description: "Learn to build complete web applications with Next.js, React, and Node.js.",
    image: "/placeholder.svg?height=300&width=600&query=nextjs fullstack development course",
    duration: "12 weeks",
    level: "Advanced",
    rating: 4.7,
    students: 756,
    link: "/training/fullstack-nextjs",
    tags: ["Next.js", "React", "Node.js", "Full-Stack"],
    type: "course",
  },
  {
    id: "react-native",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications for iOS and Android using React Native.",
    image: "/placeholder.svg?height=300&width=600&query=react native mobile app development course",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.6,
    students: 823,
    link: "/training/react-native",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    type: "course",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and user experience design to create intuitive digital products.",
    image: "/placeholder.svg?height=300&width=600&query=ui ux design course wireframes prototypes",
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.8,
    students: 1102,
    link: "/training/ui-ux-design",
    tags: ["UI", "UX", "Design", "Figma"],
    type: "course",
  },
  {
    id: "ai-ml-fundamentals",
    title: "AI and Machine Learning Fundamentals",
    description: "Introduction to artificial intelligence and machine learning concepts and applications.",
    image: "/placeholder.svg?height=300&width=600&query=ai machine learning course fundamentals",
    duration: "8 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 678,
    link: "/training/ai-ml-fundamentals",
    tags: ["AI", "Machine Learning", "Python"],
    type: "course",
  },
  {
    id: "modern-js-frameworks",
    title: "Modern JavaScript Frameworks",
    description: "Compare and contrast popular JavaScript frameworks like React, Vue, and Angular.",
    image: "/placeholder.svg?height=300&width=600&query=javascript frameworks comparison workshop",
    date: "June 15, 2023",
    duration: "3 hours",
    instructor: "Sarah Johnson",
    link: "/training/workshops/modern-js-frameworks",
    tags: ["JavaScript", "React", "Vue", "Angular"],
    type: "workshop",
  },
  {
    id: "responsive-design",
    title: "Responsive Design Masterclass",
    description: "Learn advanced techniques for creating responsive layouts that work on all devices.",
    image: "/placeholder.svg?height=300&width=600&query=responsive web design workshop",
    date: "July 8, 2023",
    duration: "4 hours",
    instructor: "Michael Chen",
    link: "/training/workshops/responsive-design",
    tags: ["CSS", "Responsive", "Design"],
    type: "workshop",
  },
  {
    id: "api-design",
    title: "RESTful API Design Principles",
    description: "Best practices for designing scalable and maintainable RESTful APIs.",
    image: "/placeholder.svg?height=300&width=600&query=api design workshop rest",
    date: "August 22, 2023",
    duration: "3 hours",
    instructor: "David Wilson",
    link: "/training/workshops/api-design",
    tags: ["API", "REST", "Backend"],
    type: "workshop",
  },
  {
    id: "web-security",
    title: "Web Security Fundamentals",
    description: "Essential security concepts and practices for web developers.",
    image: "/placeholder.svg?height=300&width=600&query=web security workshop cybersecurity",
    format: "PDF",
    pages: 45,
    link: "/training/resources/web-security",
    tags: ["Security", "OWASP", "Authentication"],
    type: "resource",
  },
  {
    id: "css-grid-flexbox",
    title: "CSS Grid and Flexbox Cheatsheet",
    description: "Comprehensive reference guide for CSS Grid and Flexbox layouts.",
    image: "/placeholder.svg?height=300&width=600&query=css grid flexbox cheatsheet",
    format: "PDF",
    pages: 12,
    link: "/training/resources/css-grid-flexbox",
    tags: ["CSS", "Grid", "Flexbox"],
    type: "resource",
  },
  {
    id: "git-workflow",
    title: "Git Workflow Best Practices",
    description: "Learn efficient Git workflows for individual and team development.",
    image: "/placeholder.svg?height=300&width=600&query=git workflow guide version control",
    format: "eBook",
    pages: 28,
    link: "/training/resources/git-workflow",
    tags: ["Git", "GitHub", "Version Control"],
    type: "resource",
  },
]

export default function TrainingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Training & Resources</h1>
        <p className="text-xl text-muted-foreground">
          Enhance your skills with our comprehensive training programs, workshops, and resources
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full mb-12">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="course">Courses</TabsTrigger>
            <TabsTrigger value="workshop">Workshops</TabsTrigger>
            <TabsTrigger value="resource">Resources</TabsTrigger>
          </TabsList>
        </div>

        {/* All Content */}
        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className={`${
                        item.type === "course"
                          ? "bg-purple-500"
                          : item.type === "workshop"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      } text-white`}
                    >
                      {item.type === "course" ? "Course" : item.type === "workshop" ? "Workshop" : "Resource"}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base mb-4 line-clamp-3">{item.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {item.type === "course" && (
                      <>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{item.students}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{item.rating}</span>
                        </div>
                      </>
                    )}
                    {item.type === "workshop" && (
                      <>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.duration}</span>
                        </div>
                      </>
                    )}
                    {item.type === "resource" && (
                      <>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{item.format}</span>
                        </div>
                        {item.pages && (
                          <div className="flex items-center">
                            <span>{item.pages} pages</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={item.link} className="w-full">
                    <Button variant="default" className="w-full group">
                      {item.type === "course" ? "View Course" : item.type === "workshop" ? "Register" : "Download"}
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Courses */}
        <TabsContent value="course" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses
              .filter((item) => item.type === "course")
              .map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base mb-4 line-clamp-3">{course.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={course.link} className="w-full">
                      <Button variant="default" className="w-full group">
                        View Course
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Workshops */}
        <TabsContent value="workshop" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses
              .filter((item) => item.type === "workshop")
              .map((workshop) => (
                <Card
                  key={workshop.id}
                  className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={workshop.image || "/placeholder.svg"}
                      alt={workshop.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-blue-500 text-white">
                        Workshop
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{workshop.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base mb-4">{workshop.description}</CardDescription>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Instructor: {workshop.instructor}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workshop.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={workshop.link} className="w-full">
                      <Button variant="default" className="w-full group">
                        Register Now
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resource" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses
              .filter((item) => item.type === "resource")
              .map((resource) => (
                <Card
                  key={resource.id}
                  className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Resource
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-base mb-4">{resource.description}</CardDescription>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Format: {resource.format}</span>
                      </div>
                      {resource.pages && (
                        <div className="flex items-center">
                          <span className="ml-6">{resource.pages} pages</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={resource.link} className="w-full">
                      <Button variant="default" className="w-full group">
                        Download
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <div className="mt-20 text-center bg-gradient-to-r from-purple-500/10 to-indigo-600/10 p-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Custom Training for Teams</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          We offer customized training programs for teams and organizations. Contact us to discuss your specific
          training needs.
        </p>
        <Link href="/contact?subject=Custom Training">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            Inquire About Custom Training
          </Button>
        </Link>
      </div>
    </div>
  )
}
