import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "skeleton" | "dots"
  size?: "sm" | "md" | "lg"
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant = "spinner", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8"
    }

    if (variant === "spinner") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center", className)}
          {...props}
        >
          <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        </div>
      )
    }

    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center space-x-1", className)}
          {...props}
        >
          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
        </div>
      )
    }

    // Skeleton variant
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-muted",
          size === "sm" && "h-4",
          size === "md" && "h-6",
          size === "lg" && "h-8",
          className
        )}
        {...props}
      />
    )
  }
)
Loading.displayName = "Loading"

// Skeleton components for different content types
const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Loading
        key={i}
        variant="skeleton"
        className={cn(
          "h-4 w-full",
          i === lines - 1 && "w-3/4" // Last line shorter
        )}
      />
    ))}
  </div>
)

const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-lg border p-6 space-y-4", className)}>
    <Loading variant="skeleton" className="h-6 w-1/3" />
    <SkeletonText lines={2} />
    <div className="flex space-x-2">
      <Loading variant="skeleton" className="h-8 w-16" />
      <Loading variant="skeleton" className="h-8 w-16" />
    </div>
  </div>
)

export { Loading, SkeletonText, SkeletonCard }
