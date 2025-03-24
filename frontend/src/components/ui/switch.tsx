import * as React from "react"
import { cn } from "../../lib/utils"

interface SwitchProps {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Switch = (props: SwitchProps) => {
  const { className, checked = false, onChange } = props
  const [isChecked, setIsChecked] = React.useState(checked)

  const handleClick = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    if (onChange) {
      onChange(newChecked)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleClick}
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "data-[state=checked]" : "data-[state=unchecked]",
        className
      )}
    >
      <span
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          isChecked ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
        )}
      />
    </button>
  )
}

export { Switch }