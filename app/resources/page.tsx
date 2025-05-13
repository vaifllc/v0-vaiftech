import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Download, ExternalLink, FileText, Play, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Workshops & Resources | VAIF TECH",
  description: "Access our workshops, webinars, ebooks, and other resources to enhance your knowledge and skills.",
}

const workshops = [
  {
    title: "Building Scalable Web Applications",
    description: "Learn how to design and build web applications that can scale to millions of users.",
    image: "/placeholder.svg?height=300&width=600&query=web application scalability workshop",
    date: "June 15, 2023",
    duration: "3 hours",
    instructor: "Alex Johnson",
    attendees: 120,
    link: "/resources/workshops/scalable-web-apps",
    tags: ["Web Development", "Scalability", "Architecture"],
  },
  {
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and techniques to build more maintainable and efficient applications.",
    image: "/placeholder.svg?height=300&width=600&query=advanced react patterns workshop",
    date: "July 8, 2023",
    duration: "4 hours",
    instructor: "Sarah Chen",
    attendees: 85,
    link: "/resources/workshops/advanced-react",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    title: "Optimizing Website Performance",
    description: "Techniques and strategies to improve website loading times and overall performance.",
    image: "/placeholder.svg?height=300&width=600&query=website performance optimization workshop",
    date: "August 22, 2023",
    duration: "2 hours",
    instructor: "Michael Rodriguez",
    attendees: 150,
    link: "/resources/workshops/website-performance",
    tags: ["Performance", "Optimization", "Web Development"],
  },
  {
    title: "Introduction to AI in Web Applications",
    description: "Learn how to integrate AI capabilities into your web applications.",
    image: "/placeholder.svg?height=300&width=600&query=ai integration web applications workshop",
    date: "September 10, 2023",
    duration: "3 hours",
    instructor: "Dr. Emily Watson",
    attendees: 95,
    link: "/resources/workshops/ai-web-apps",
    tags: ["AI", "Web Development", "Integration"],
  },
]

const ebooks = [
  {
    title: "The Complete Guide to Modern Web Development",
    description: "A comprehensive guide covering all aspects of modern web development, from frontend to backend.",
    image: "/placeholder.svg?height=300&width=600&query=web development ebook cover",
    pages: 250,
    format: "PDF",
    link: "/resources/ebooks/modern-web-development",
    tags: ["Web Development", "Frontend", "Backend"],
  },
  {
    title: "Mobile App Development: Best Practices",
    description: "Learn the best practices for developing high-quality mobile applications for iOS and Android.",
    image: "/placeholder.svg?height=300&width=600&query=mobile app development ebook cover",
    pages: 180,
    format: "PDF",
    link: "/resources/ebooks/mobile-app-best-practices",
    tags: ["Mobile Development", "iOS", "Android"],
  },
  {
    title: "UI/UX Design Principles for Developers",
    description:
      "Essential UI/UX design principles that every developer should know to create better user experiences.",
    image: "/placeholder.svg?height=300&width=600&query=ui ux design ebook cover",
    pages: 150,
    format: "PDF",
    link: "/resources/ebooks/ui-ux-for-developers",
    tags: ["UI/UX", "Design", "User Experience"],
  },
  {
    title: "E-Commerce Development Strategies",
    description: "Strategies and techniques for building successful e-commerce platforms.",
    image: "/placeholder.svg?height=300&width=600&query=ecommerce development ebook cover",
    pages: 200,
    format: "PDF",
    link: "/resources/ebooks/ecommerce-strategies",
    tags: ["E-Commerce", "Web Development", "Business"],
  },
]

const webinars = [
  {
    title: "The Future of Web Development",
    description: "Explore upcoming trends and technologies that will shape the future of web development.",
    image: "/placeholder.svg?height=300&width=600&query=future web development webinar",
    date: "May 5, 2023",
    duration: "1 hour",
    presenter: "David Kim",
    views: 3500,
    link: "/resources/webinars/future-web-dev",
    tags: ["Web Development", "Trends", "Future Tech"],
  },
  {
    title: "Securing Your Web Applications",
    description: "Learn essential security practices to protect your web applications from common vulnerabilities.",
    image: "/placeholder.svg?height=300&width=600&query=web application security webinar",
    date: "June 20, 2023",
    duration: "1.5 hours",
    presenter: "Lisa Martinez",
    views: 2800,
    link: "/resources/webinars/web-security",
    tags: ["Security", "Web Development", "Best Practices"],
  },
  {
    title: "Responsive Design Masterclass",
    description: "Master the art of creating truly responsive designs that work across all devices and screen sizes.",
    image: "/placeholder.svg?height=300&width=600&query=responsive design webinar",
    date: "July 15, 2023",
    duration: "1 hour",
    presenter: "Thomas Wilson",
    views: 4200,
    link: "/resources/webinars/responsive-design",
    tags: ["Responsive Design", "CSS", "Frontend"],
  },
  {
    title: "Building Progressive Web Apps",
    description: "Learn how to transform your website into a Progressive Web App for better user engagement.",
    image: "/placeholder.svg?height=300&width=600&query=progressive web apps webinar",
    date: "August 10, 2023",
    duration: "1.5 hours",
    presenter: "Sophia Lee",
    views: 3100,
    link: "/resources/webinars/progressive-web-apps",
    tags: ["PWA", "Web Development", "Mobile"],
  },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Workshops & Resources</h1>
        <p className="text-xl text-muted-foreground">
          Enhance your knowledge and skills with our workshops, webinars, ebooks, and other resources
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workshops" className="mb-16">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="ebooks">E-Books</TabsTrigger>
        </TabsList>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workshops.map((workshop, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={workshop.image || "/placeholder.svg"}
                    alt={workshop.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{workshop.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base mb-4 line-clamp-3">{workshop.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {workshop.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{workshop.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{workshop.attendees} attendees</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={workshop.link} className="w-full">
                    <Button variant="default" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webinars Tab */}
        <TabsContent value="webinars" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {webinars.map((webinar, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={webinar.image || "/placeholder.svg"}
                    alt={webinar.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base mb-4 line-clamp-3">{webinar.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {webinar.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{webinar.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{webinar.views} views</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={webinar.link} className="w-full">
                    <Button variant="default" className="w-full">
                      Watch Webinar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* E-Books Tab */}
        <TabsContent value="ebooks" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ebooks.map((ebook, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={ebook.image || "/placeholder.svg"}
                    alt={ebook.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{ebook.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base mb-4 line-clamp-3">{ebook.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ebook.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{ebook.pages} pages</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      <span>{ebook.format} format</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={ebook.link} className="w-full">
                    <Button variant="default" className="w-full">
                      Download E-Book
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-600/10 p-12 rounded-lg mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to receive updates on new resources, upcoming workshops, and exclusive
              content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-border bg-background"
              />
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600&query=digital newsletter subscription concept"
              alt="Newsletter"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Web Development Summit 2023",
              date: "October 15-17, 2023",
              location: "Virtual Event",
              description:
                "Join industry experts for three days of talks, workshops, and networking focused on the latest web development trends and technologies.",
              link: "/events/web-dev-summit-2023",
            },
            {
              title: "Mobile App Development Workshop",
              date: "November 5, 2023",
              location: "San Francisco, CA",
              description:
                "A hands-on workshop covering the latest techniques and best practices in mobile app development.",
              link: "/events/mobile-app-workshop-2023",
            },
            {
              title: "AI in Tech Conference",
              date: "December 8-9, 2023",
              location: "New York, NY",
              description:
                "Explore the intersection of AI and technology with keynotes, panel discussions, and interactive sessions.",
              link: "/events/ai-tech-conference-2023",
            },
          ].map((event, index) => (
            <Card
              key={index}
              className="border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start">
                    <ExternalLink className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <span>{event.location}</span>
                  </div>
                  <CardDescription className="text-base">{event.description}</CardDescription>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={event.link} className="w-full">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Need Custom Resources?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          We can create custom training materials, workshops, or documentation tailored to your organization's specific
          needs.
        </p>
        <Link href="/contact?subject=Custom Resources">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  )
}
