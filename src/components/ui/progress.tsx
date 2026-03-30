import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "blue" | "green" | "purple" | "orange";
}

const variantStyles: Record<string, string> = {
  default: "bg-primary",
  blue: "bg-gradient-to-r from-blue-400 to-blue-600",
  green: "bg-gradient-to-r from-emerald-400 to-emerald-600",
  purple: "bg-gradient-to-r from-violet-400 to-violet-600",
  orange: "bg-gradient-to-r from-orange-400 to-orange-500",
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div
        ref={ref}
        className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
