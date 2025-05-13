import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Github, Send } from "lucide-react"

// Footer links
const footerLinks = [
  {
    title: "Products",
    links: [
      { name: "Digital Products", href: "#" },
      { name: "Source Code", href: "#" },
      { name: "eBooks", href: "#" },
      { name: "Licensing", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Custom Development", href: "#" },
      { name: "AI Integration", href: "#" },
      { name: "Consulting", href: "#" },
      { name: "Support", href: "#" },
    ],
  },
  {
    title: "Training",
    links: [
      { name: "Courses", href: "#" },
      { name: "Workshops", href: "#" },
      { name: "Resources", href: "#" },
      { name: "Certification", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
]

// Social media links
const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
]

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-400 via-blue-600 to-indigo-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  V
                </div>
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                VAIF TECH
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              VAIF TECH provides comprehensive digital solutions including custom development, digital products, and
              educational content powered by cutting-edge AI technology.
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-xs" />
                <Button
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-medium mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} VAIF TECH. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
