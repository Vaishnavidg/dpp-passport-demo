import { Shield, Users, Coins } from "lucide-react";
import { ClaimTopicsTab } from "./ClaimTopicsTab";
import { TrustedIssuersTab } from "./TrustedIssuersTab";
import { TokenManagerTab } from "./TokenManagerTab";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

export function AdminDashboard() {
  const tabs = [
    {
      value: "claim-topics",
      label: "Claim Topics",
      icon: Shield,
      content: <ClaimTopicsTab />
    },
    {
      value: "trusted-issuers",
      label: "Trusted Issuers",
      icon: Users,
      content: <TrustedIssuersTab />
    },
    {
      value: "token-manager",
      label: "Token Manager",
      icon: Coins,
      content: <TokenManagerTab />
    }
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Manage ERC-3643 compliance framework and regulated tokens"
      badgeText="Administrator Access"
      badgeVariant="default"
      icon={Shield}
      tabs={tabs}
      defaultTab="claim-topics"
    />
  );
}
