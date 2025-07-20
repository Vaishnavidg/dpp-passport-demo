import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconContainer } from "./icon-container";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  size = "md",
  className 
}: FeatureCardProps) {
  return (
    <Card className={`text-center ${className || ""}`}>
      <CardHeader>
        <IconContainer size={size} className="mb-4">
          <Icon className={`${size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"} text-primary`} />
        </IconContainer>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
} 