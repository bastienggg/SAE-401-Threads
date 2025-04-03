import { cn } from "../../lib/utils"
import { cva, VariantProps } from "class-variance-authority"

interface SwitchProps extends VariantProps<typeof switchVariants> {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const switchVariants = cva(
  "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        secondary: "bg-red-500",
      },
      isChecked: {
        true: "",
        false: "bg-[var(--color-muted)]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

const Switch = (props: SwitchProps) => {
  const { className, checked = false, onChange, variant, ...rest } = props

  const handleClick = () => {
    if (onChange) {
      onChange(!checked) // Inverse la valeur et appelle la fonction onChange
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={cn(
        switchVariants({ variant, isChecked: checked }),
        className
      )}
      {...rest}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform bg-white",
          checked ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
        )}
      />
    </button>
  )
}

export { Switch }