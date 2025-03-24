import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "../../lib/utils"

interface DialogProps {
  className?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  [key: string]: any;
}

function Dialog({ className, open, onClose, ...props }: DialogProps) {
  return open ? <div data-slot="dialog" className={cn("dialog-root", className)} {...props} /> : null;
}

function DialogTrigger({ className, ...props }: DialogProps) {
  return <button data-slot="dialog-trigger" className={cn("dialog-trigger", className)} {...props} />
}

function DialogPortal({ className, ...props }: DialogProps) {
  return <div data-slot="dialog-portal" className={cn("dialog-portal", className)} {...props} />
}

function DialogClose({ className, ...props }: DialogProps) {
  return <button data-slot="dialog-close" className={cn("dialog-close", className)} {...props} />
}

function DialogOverlay({ className, ...props }: DialogProps) {
  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: DialogProps) {
  return (
    <DialogPortal data-slot="dialog-portal" open={props.open} onClose={props.onClose}>
      <DialogOverlay open={props.open} onClose={props.onClose} />
      <div
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        <button onClick={props.onClose} className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: DialogProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: DialogProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogProps) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogProps) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}