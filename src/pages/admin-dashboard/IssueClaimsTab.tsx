import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Send, Info, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/config";

interface IssuedClaim {
  userAddress: string;
  topicId: number;
  topicName: string;
  timestamp: string;
}

export function IssueClaimsTab() {
  const [issuedClaims, setIssuedClaims] = useState<IssuedClaim[]>([]);
  const [newClaim, setNewClaim] = useState({ userAddress: "", topicId: "" });
  const [isIssuing, setIsIssuing] = useState(false);
  const { toast } = useToast();

  const availableTopics = MOCK_DATA.claimTopics;

  const handleIssueClaim = async () => {
    if (!newClaim.userAddress || !newClaim.topicId) {
      toast({
        title: "Missing Information",
        description: "Please provide both user address and claim topic",
        variant: "destructive",
      });
      return;
    }

    setIsIssuing(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const topicId = parseInt(newClaim.topicId);
      const topic = availableTopics.find((t) => t.id === topicId);

      const claim: IssuedClaim = {
        userAddress: newClaim.userAddress,
        topicId,
        topicName: topic?.name || `Topic ${topicId}`,
        timestamp: new Date().toISOString(),
      };

      setIssuedClaims([claim, ...issuedClaims]);
      setNewClaim({ userAddress: "", topicId: "" });

      toast({
        title: "Claim Issued Successfully",
        description: `${
          claim.topicName
        } claim issued to ${claim.userAddress.slice(
          0,
          6
        )}...${claim.userAddress.slice(-4)}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to Issue Claim",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Issue Identity Claim
          </CardTitle>
          <CardDescription>
            Issue claims to user identities for compliance verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Claims are cryptographic attestations that verify specific
              attributes about an identity. Only users with valid claims can
              interact with regulated tokens.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="user-address">User Address</Label>
              <Input
                id="user-address"
                placeholder="0x..."
                value={newClaim.userAddress}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, userAddress: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="claim-topic">Claim Topic</Label>
              <Select
                value={newClaim.topicId}
                onValueChange={(value) =>
                  setNewClaim({ ...newClaim, topicId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a claim topic" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name} (ID: {topic.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleIssueClaim}
              className="w-full"
              variant="default"
              disabled={isIssuing}
            >
              {isIssuing ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Issue Claim
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recently Issued Claims
          </CardTitle>
          <CardDescription>Claims issued to user identities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {issuedClaims.map((claim, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-success/20 text-success-foreground">
                      {claim.topicName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(claim.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <Badge variant="outline" className="text-xs">
                      {formatAddress(claim.userAddress)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {issuedClaims.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No claims issued yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
