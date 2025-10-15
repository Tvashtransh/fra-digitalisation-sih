import React from "react"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <div className="h-full w-full overflow-auto">
      {children}
    </div>
  </div>
))

ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex touch-none select-none transition-colors", className)}
    {...props}
  />
))

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }