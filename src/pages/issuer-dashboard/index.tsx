import { Shield, FileText } from "lucide-react";
import { IssueClaimsTab } from "./IssueClaimsTab";
import { ClaimRequestsTab } from "./ClaimRequestsTab";
import { DashboardLayout } from "@/components/ui/dashboard-layout";

export function IssuerDashboard() {
  const tabs = [
    {
      value: "claim-requests",
      label: "Requests",
      icon: Shield,
      content: <ClaimRequestsTab />
    },
    {
      value: "issue-claims",
      label: "Issue Claims",
      icon: FileText,
      content: <IssueClaimsTab />
    }
  ];

  return (
    <DashboardLayout
      title="Issuer Dashboard"
      description="Review user data and issue claims for identity verification"
      badgeText="Trusted Issuer Access"
      badgeVariant="default"
      icon={Shield}
      tabs={tabs}
      defaultTab="claim-requests"
    />
  );
}
