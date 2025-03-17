const base = "mes classes de base";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const InputVariants = cva(base, {
  variants: {
    intent: {
      base: "w-full rounded-lg border-2 border-neutral-200 bg-neutral-50 p-2 text-neutral-900 hover:cursor-text hover:border-neutral-800 focus:border-neutral-800",
    },
  },
});

interface Input {
  className?: string;
  intent?: "base";
  type?: string; // Add type prop
  autoComplete?: string; // Add autoComplete prop
  placeholder?: string; // Add placeholder prop
}

export default function Input({
  className,
  intent,
  type = "text",
  autoComplete,
  placeholder, // Add placeholder prop
  ...props
}: Input) {
  return (
    <input
      type={type}
      className={cn(InputVariants({ intent }), className)}
      autoComplete={autoComplete}
      placeholder={placeholder} // Add placeholder attribute
      {...props}
    />
  );
}

export type { Input };
