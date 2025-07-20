import { ReactNode } from "react";

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  description: string;
  className?: string;
}

export function StepIndicator({ 
  stepNumber, 
  title, 
  description, 
  className 
}: StepIndicatorProps) {
  return (
    <div className={`text-center ${className || ""}`}>
      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
        {stepNumber}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 