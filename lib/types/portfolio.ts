export type ProjectType =
  | "website"
  | "mobile-app"
  | "pwa"
  | "logo"
  | "branding"
  | "shopify"
  | "ecommerce"
  | "web-app"
  | "ui-ux"

export type TechStack = {
  name: string
  icon?: string
  color?: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  clientName: string
  projectType: ProjectType
  techStack: TechStack[]
  duration: string
  completionDate: string
  url?: string
  images: string[]
  featured: boolean
  categories: string[]
}
