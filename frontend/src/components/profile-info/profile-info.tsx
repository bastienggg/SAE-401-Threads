import { CardContent } from "../ui/card"
import { MapPin, LinkIcon } from "lucide-react"

interface ProfileInfoProps {
  bio: string | null
  place: string | null
  link: string | null
}

export default function ProfileInfo({ bio, place, link }: ProfileInfoProps) {
  return (
    <CardContent className="space-y-3 md:space-y-4 px-4">
      {/* Bio */}
      <div>
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Bio</h3>
        <p className="text-xs md:text-sm text-muted-foreground italic">{bio || "No bio provided"}</p>
      </div>

      {/* Location */}
      <div className="flex items-center text-xs md:text-sm">
        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">{place || "No location provided"}</span>
      </div>

      {/* Website */}
      <div className="flex items-center text-xs md:text-sm">
        <LinkIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-muted-foreground" />
        {link ? (
          <a href={link} className="text-blue-500 hover:underline">
            {link}
          </a>
        ) : (
          <span className="text-muted-foreground">No website provided</span>
        )}
      </div>
    </CardContent>
  )
}
