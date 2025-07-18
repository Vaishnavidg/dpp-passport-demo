import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Shield,
  FileCheck,
  MapPin,
  Building,
  RefreshCw,
} from "lucide-react";

interface ClaimRequest {
  id: string;
  claimType: string;
  issuerAddress: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  message?: string;
}

const claimTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  kyc: User,
  aml: Shield,
  "proof-of-residency": MapPin,
  "business-license": Building,
  "identity-document": FileCheck,
};

const claimTypeNames: Record<string, string> = {
  kyc: "KYC Verification",
  aml: "AML Compliance",
  "proof-of-residency": "Proof of Residency",
  "business-license": "Business License",
  "identity-document": "Identity Document",
};

// Mock data for demonstration
const mockRequests: ClaimRequest[] = [
  {
    id: "1",
    claimType: "kyc",
    issuerAddress: "0x742d35Cc6634C0532925a3b8D0829677fa3fD5D",
    status: "approved",
    timestamp: "2024-01-15T10:30:00Z",
    message: "Standard KYC verification for token access",
  },
  {
    id: "2",
    claimType: "aml",
    issuerAddress: "0x742d35Cc6634C0532925a3b8D0829677fa3fD5D",
    status: "pending",
    timestamp: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    claimType: "proof-of-residency",
    issuerAddress: "0x8ba1f109551bD432803012645Hac136c59dd5043e",
    status: "rejected",
    timestamp: "2024-01-10T09:15:00Z",
    message: "Address verification for regulatory compliance",
  },
];

export function MyClaimRequestsList() {
  const [requests, setRequests] = useState<ClaimRequest[]>(mockRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: ClaimRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ClaimRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-warning border-warning">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-success border-success">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Claim Requests Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't requested any claims yet. Use the "Request Claim" button to submit your first identity verification request.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Claim Requests</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {requests.map((request) => {
          const ClaimIcon = claimTypeIcons[request.claimType] || Shield;
          
          return (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ClaimIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {claimTypeNames[request.claimType] || request.claimType}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Requested {formatTimestamp(request.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Issuer Address</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {request.issuerAddress.slice(0, 6)}...{request.issuerAddress.slice(-4)}
                    </p>
                  </div>
                  
                  {request.message && (
                    <div>
                      <p className="text-sm font-medium">Message</p>
                      <p className="text-sm text-muted-foreground">{request.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}