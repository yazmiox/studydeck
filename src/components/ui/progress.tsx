import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
      indicatorClassName?: string;
      dynamicColor?: boolean; 
  }
>(({ className, value, indicatorClassName, dynamicColor = false, ...props }, ref) => {
  
  let bgClass = "bg-primary";
  if (dynamicColor && value !== null && value !== undefined) {
      if (value >= 100) bgClass = "bg-green-500";
      else if (value >= 70) bgClass = "bg-primary";
      else if (value >= 30) bgClass = "bg-yellow-500";
      else bgClass = "bg-red-500";
  }

  return (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", bgClass, indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
