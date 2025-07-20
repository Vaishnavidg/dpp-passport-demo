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
import { Shield, Users, FileText } from "lucide-react";
import { IssueClaimsTab } from "./IssueClaimsTab";
import { RegisteredUsersTab } from "./RegisteredUsersTab";
import { ClaimRequestsTab } from "./ClaimRequestsTab";

export function IssuerDashboard() {
  const [activeTab, setActiveTab] = useState("claim-requests");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Issuer Dashboard</h1>
            <p className="text-muted-foreground">
              Review user data and issue claims for identity verification
            </p>
          </div>
        </div>
        <Badge className="bg-gradient-primary text-primary-foreground">
          Trusted Issuer Access
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
          <TabsTrigger value="claim-requests" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          {/* <TabsTrigger value="registered-users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger> */}
          <TabsTrigger value="issue-claims" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Issue Claims</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claim-requests">
          <ClaimRequestsTab />
        </TabsContent>

        {/* <TabsContent value="registered-users">
          <RegisteredUsersTab />
        </TabsContent> */}

        <TabsContent value="issue-claims">
          <IssueClaimsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
