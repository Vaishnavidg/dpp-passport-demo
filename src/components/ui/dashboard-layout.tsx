import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface DashboardLayoutProps {
  title: string;
  description: string;
  badgeText: string;
  badgeVariant?: "default" | "outline";
  icon: LucideIcon;
  tabs: TabItem[];
  defaultTab?: string;
}

export function DashboardLayout({
  title,
  description,
  badgeText,
  badgeVariant = "default",
  icon: Icon,
  tabs,
  defaultTab
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || "");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <Badge 
          variant={badgeVariant}
          className={badgeVariant === "default" ? "bg-gradient-primary text-primary-foreground" : ""}
        >
          {badgeText}
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className={`grid w-full grid-cols-${tabs.length} bg-secondary/50`}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 