import { ReactNode } from "react";
import { cn } from "../../../lib/utils";

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    subtitle?: string;
    className?: string;
}

export function DashboardCard({ title, value, icon, subtitle, className }: DashboardCardProps) {
    return (
        <div className={cn("bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {icon}
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                {subtitle && <span className="text-sm text-muted-foreground mt-1">{subtitle}</span>}
            </div>
        </div>
    );
}
