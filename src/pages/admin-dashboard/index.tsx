import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, Coins } from "lucide-react";
import { ClaimTopicsTab } from "./ClaimTopicsTab";
import { TrustedIssuersTab } from "./TrustedIssuersTab";
import { IssueClaimsTab } from "./IssueClaimsTab";
import { TokenManagerTab } from "./TokenManagerTab";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("claim-topics");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage ERC-3643 compliance framework and regulated tokens
            </p>
          </div>
        </div>
        <Badge className="bg-gradient-primary text-primary-foreground">
          Administrator Access
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="claim-topics" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Claim Topics</span>
          </TabsTrigger>
          <TabsTrigger value="trusted-issuers" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Trusted Issuers</span>
          </TabsTrigger>
          <TabsTrigger value="issue-claims" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Issue Claims</span>
          </TabsTrigger>
          <TabsTrigger value="token-manager" className="gap-2">
            <Coins className="h-4 w-4" />
            <span className="hidden sm:inline">Token Manager</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claim-topics">
          <ClaimTopicsTab />
        </TabsContent>

        <TabsContent value="trusted-issuers">
          <TrustedIssuersTab />
        </TabsContent>

        <TabsContent value="issue-claims">
          <IssueClaimsTab />
        </TabsContent>

        <TabsContent value="token-manager">
          <TokenManagerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
