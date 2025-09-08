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
import { User, Shield, FileText, Send } from "lucide-react";
import { CreateIdentityTab } from "./CreateIdentityTab";
import { RegisterIdentityTab } from "./RegisterIdentityTab";
import { MyClaimsTab } from "./MyClaimsTab";
import { TransferTokenTab } from "./TransferTokenTab";
import { ClaimRequestsTab } from "./ClaimRequestsTab";

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("create-identity");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your identity and regulated token interactions
            </p>
          </div>
        </div>
        <Badge variant="outline">ERC-3643 Compliance</Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="create-identity" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Create Identity</span>
          </TabsTrigger>
          <TabsTrigger value="claim-requests" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="my-claims" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">My Claims</span>
          </TabsTrigger>
          <TabsTrigger value="transfer-token" className="gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Transfer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create-identity">
          <CreateIdentityTab />
        </TabsContent>

        <TabsContent value="register-identity">
          <RegisterIdentityTab />
        </TabsContent>

        <TabsContent value="claim-requests">
          <ClaimRequestsTab />
        </TabsContent>

        <TabsContent value="my-claims">
          <MyClaimsTab />
        </TabsContent>

        <TabsContent value="transfer-token">
          <TransferTokenTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
