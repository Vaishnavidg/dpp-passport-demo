import { User, Shield, FileText, Send } from "lucide-react";
import { CreateIdentityTab } from "./CreateIdentityTab";
import { RegisterIdentityTab } from "./RegisterIdentityTab";
import { MyClaimsTab } from "./MyClaimsTab";
import { TransferTokenTab } from "./TransferTokenTab";
import { ClaimRequestsTab } from "./ClaimRequestsTab";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

export function UserDashboard() {
  const tabs = [
    {
      value: "create-identity",
      label: "Create Identity",
      icon: User,
      content: <CreateIdentityTab />
    },
    {
      value: "claim-requests",
      label: "Requests",
      icon: Shield,
      content: <ClaimRequestsTab />
    },
    {
      value: "my-claims",
      label: "My Claims",
      icon: FileText,
      content: <MyClaimsTab />
    },
    {
      value: "transfer-token",
      label: "Transfer",
      icon: Send,
      content: <TransferTokenTab />
    }
  ];

  return (
    <DashboardLayout
      title="User Dashboard"
      description="Manage your identity and regulated token interactions"
      badgeText="ERC-3643 Compliance"
      badgeVariant="outline"
      icon={User}
      tabs={tabs}
      defaultTab="create-identity"
    />
  );
}
