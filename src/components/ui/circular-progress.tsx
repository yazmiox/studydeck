import * as React from "react"
import { cn } from "../../lib/utils"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    size?: number;
    strokeWidth?: number;
    showValue?: boolean;
}

export function getProgressColorClass(value: number) {
    if (value >= 100) return "text-green-500";
    if (value >= 70) return "text-primary"; // Blue
    if (value >= 30) return "text-yellow-500";
    return "text-red-500";
}

export function CircularProgress({ 
    value, 
    size = 120, 
    strokeWidth = 10, 
    showValue = true,
    className,
    ...props 
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const colorClass = getProgressColorClass(value);

    return (
        <div 
            className={cn("relative flex items-center justify-center", className)} 
            style={{ width: size, height: size }}
            {...props}
        >
            <svg 
                className="transform -rotate-90 w-full h-full"
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    className="text-muted stroke-current"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className={cn("stroke-current transition-all duration-1000 ease-out", colorClass)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {showValue && (
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className={cn(
                        "font-bold tracking-tight transition-all",
                        value >= 100 ? "text-xl" : "text-2xl"
                    )}>
                        {Math.round(value)}%
                    </span>
                </div>
            )}
        </div>
    )
}
