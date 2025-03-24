import { CardHeader } from "../ui/card"
import { Mail } from "lucide-react"

interface ProfileHeaderProps {
  pseudo: string
  email: string
}

export default function ProfileHeader({ pseudo, email }: ProfileHeaderProps) {
  return (
    <CardHeader className="pt-16 md:pt-20 pb-2 md:pb-4">
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl md:text-2xl font-bold">@{pseudo}</h1>
        <div className="flex items-center text-muted-foreground text-sm">
          <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          <span>{email}</span>
        </div>
      </div>
    </CardHeader>
  )
}

