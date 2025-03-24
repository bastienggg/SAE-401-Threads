import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface ProfileAvatarProps {
  avatar: string | null
  pseudo: string
}

export default function ProfileAvatar({ avatar, pseudo }: ProfileAvatarProps) {
  return (
    <div className="absolute -bottom-12 md:-bottom-16 left-4 md:left-8">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white">
        <AvatarImage src={avatar || ""} alt={pseudo} />
        <AvatarFallback className="text-xl md:text-3xl bg-primary text-primary-foreground">
          {pseudo.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

