const base = "mes classes de base";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(base, {
  variants: {
    intent: {
      base: "w-full rounded-lg bg-neutral-900 py-2 text-white hover:cursor-pointer hover:bg-neutral-800",
    },
  },
});

interface ButtonProps {
  className?: string;
  intent?: "base";
  children: React.ReactNode;
}

export default function Button({
  className,
  intent,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ intent }), className)} {...props}>
      {children}
    </button>
  );
}

export { Button };
