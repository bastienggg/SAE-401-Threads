import * as React from "react"
import { cn } from "../../lib/utils"

interface LabelProps {
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string;
  // Ajoutez d'autres props nécessaires ici
}

function Label({ className, children, htmlFor, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  )
}

export { Label }