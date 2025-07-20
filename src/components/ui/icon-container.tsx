import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconContainer({ 
  children, 
  size = "md", 
  className 
}: IconContainerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        "bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3",
        className
      )}
    >
      {children}
    </div>
  );
} 