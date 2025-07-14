import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/config";

interface UserClaim {
  topicId: number;
  topicName: string;
  issuer: string;
  issuedAt: string;
  signature: string;
  isValid: boolean;
  expiresAt?: string;
}

export function MyClaimsTab() {
  const [userClaims, setUserClaims] = useState<UserClaim[]>([
    {
      topicId: 1,
      topicName: "KYC Verification",
      issuer: "0x1111111111111111111111111111111111111111",
      issuedAt: new Date(Date.now() - 86400000).toISOString(),
      signature: "0xabcdef...",
      isValid: true,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
    },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshClaims = async () => {
    setIsRefreshing(true);

    try {
      // Simulate fetching claims from blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Claims Refreshed",
        description: "Successfully fetched latest claims from blockchain",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to fetch claims. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVerifyClaim = async (claimIndex: number) => {
    try {
      // Simulate claim verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Claim Verified",
        description: "Claim signature and validity confirmed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify claim signature",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getClaimStatusBadge = (claim: UserClaim) => {
    if (!claim.isValid) {
      return <Badge variant="destructive">Invalid</Badge>;
    }

    if (claim.expiresAt && new Date(claim.expiresAt) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return (
      <Badge className="bg-success/20 text-success-foreground">Valid</Badge>
    );
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Claims</h2>
          <p className="text-muted-foreground">
            View and verify your identity claims
          </p>
        </div>
        <Button
          onClick={handleRefreshClaims}
          variant="outline"
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {userClaims.map((claim, index) => (
          <Card key={index} className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {claim.topicName}
                </CardTitle>
                {getClaimStatusBadge(claim)}
              </div>
              <CardDescription>
                Topic ID: {claim.topicId} • Issued by trusted issuer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Issuer</h4>
                  <Badge variant="outline" className="text-xs">
                    {formatAddress(claim.issuer)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Issued Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(claim.issuedAt)}
                  </p>
                </div>
              </div>

              {claim.expiresAt && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Expiry</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(claim.expiresAt)}
                    </p>
                    {getDaysUntilExpiry(claim.expiresAt) < 30 && (
                      <Badge variant="destructive" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Expires in {getDaysUntilExpiry(claim.expiresAt)} days
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-1">Signature</h4>
                <Badge variant="outline" className="text-xs font-mono">
                  {claim.signature}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleVerifyClaim(index)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verify Signature
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {userClaims.length === 0 && (
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Claims Found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any claims yet. Contact an admin to have claims
                issued to your identity.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground text-left">
                  Valid claims from trusted issuers are required to receive and
                  transfer regulated tokens.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
