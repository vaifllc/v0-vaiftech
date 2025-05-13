import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiSupabase,
  SiGraphql,
  SiRedux,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiPhp,
  SiLaravel,
  SiWordpress,
  SiShopify,
  SiWix,
  SiSquarespace,
  SiWebflow,
  SiFigma,
  SiAdobexd,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiSass,
  SiBootstrap,
  SiMaterialui,
  SiChakraui,
  SiStyledcomponents,
  SiPrisma,
  SiStrapi,
  SiContentful,
  SiSanity,
  SiVercel,
  SiNetlify,
  SiAmazonaws,
  SiGooglecloud,
  SiMicrosoftazure,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
} from "react-icons/si"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Map of tech stack names to their respective icons
const techIcons: Record<string, any> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  HTML5: SiHtml5,
  CSS3: SiCss3,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Firebase: SiFirebase,
  Supabase: SiSupabase,
  GraphQL: SiGraphql,
  Redux: SiRedux,
  "Vue.js": SiVuedotjs,
  Angular: SiAngular,
  Svelte: SiSvelte,
  Flutter: SiFlutter,
  Kotlin: SiKotlin,
  Swift: SiSwift,
  PHP: SiPhp,
  Laravel: SiLaravel,
  WordPress: SiWordpress,
  Shopify: SiShopify,
  Wix: SiWix,
  Squarespace: SiSquarespace,
  Webflow: SiWebflow,
  Figma: SiFigma,
  "Adobe XD": SiAdobexd,
  Photoshop: SiAdobephotoshop,
  Illustrator: SiAdobeillustrator,
  Sass: SiSass,
  Bootstrap: SiBootstrap,
  "Material UI": SiMaterialui,
  "Chakra UI": SiChakraui,
  "Styled Components": SiStyledcomponents,
  Prisma: SiPrisma,
  Strapi: SiStrapi,
  Contentful: SiContentful,
  Sanity: SiSanity,
  Vercel: SiVercel,
  Netlify: SiNetlify,
  AWS: SiAmazonaws,
  "Google Cloud": SiGooglecloud,
  Azure: SiMicrosoftazure,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Git: SiGit,
  GitHub: SiGithub,
  GitLab: SiGitlab,
  Bitbucket: SiBitbucket,
}

interface TechStackProps {
  technologies: string[]
  className?: string
}

export function TechStack({ technologies, className = "" }: TechStackProps) {
  return (
    <TooltipProvider>
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {technologies.map((tech) => {
          const IconComponent = techIcons[tech]

          return IconComponent ? (
            <Tooltip key={tech}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tech}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div
              key={tech}
              className="flex items-center justify-center px-3 h-10 rounded-md bg-muted text-sm font-medium"
            >
              {tech}
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
