import { Calendar, Clock, Users, Zap, Award, Globe, BarChart, Target } from "lucide-react"

interface ProjectStatsProps {
  stats: {
    label: string
    value: string
    icon?: "calendar" | "clock" | "users" | "performance" | "award" | "global" | "analytics" | "goal"
  }[]
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="w-5 h-5 text-primary" />
      case "clock":
        return <Clock className="w-5 h-5 text-primary" />
      case "users":
        return <Users className="w-5 h-5 text-primary" />
      case "performance":
        return <Zap className="w-5 h-5 text-primary" />
      case "award":
        return <Award className="w-5 h-5 text-primary" />
      case "global":
        return <Globe className="w-5 h-5 text-primary" />
      case "analytics":
        return <BarChart className="w-5 h-5 text-primary" />
      case "goal":
        return <Target className="w-5 h-5 text-primary" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Project Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {stat.icon && getIcon(stat.icon)}
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
