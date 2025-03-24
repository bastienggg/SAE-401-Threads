import * as React from "react"
import { cn } from "../../lib/utils"

interface AvatarProps {
  className?: string;
  [key: string]: any;
}

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
  [key: string]: any;
}

function AvatarImage({ className, src, ...props }: AvatarImageProps) {
  const defaultSrc = "./src/assets/profil/default.jpg";
  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      src={src || defaultSrc}
      {...props}
    />
  )
}

interface AvatarFallbackProps {
  className?: string;
  [key: string]: any;
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }