const base = "mes classes de base";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(base, {
  variants: {
    intent: {
      base: "w-full rounded-lg bg-neutral-900 py-2 text-white hover:cursor-pointer hover:bg-neutral-800",
      primary: "w-full rounded-lg bg-blue-500 py-2 text-white hover:cursor-pointer hover:bg-blue-400",
      secondary: "w-full rounded-lg bg-gray-500 py-2 text-white hover:cursor-pointer hover:bg-gray-400",
    },
  },
});

interface ButtonProps {
  intent: 'base' | 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
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
