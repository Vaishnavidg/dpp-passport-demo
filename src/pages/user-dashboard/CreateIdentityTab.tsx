import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { User, CheckCircle, Info, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EDUCATIONAL_MESSAGES } from "@/lib/config";

export function CreateIdentityTab() {
  const [identityAddress, setIdentityAddress] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();

  const handleDeployIdentity = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    try {
      // Simulate identity contract deployment
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate a mock identity contract address
      const mockIdentityAddress = `0x${Math.random()
        .toString(16)
        .slice(2, 42)
        .padStart(40, "0")}`;
      setIdentityAddress(mockIdentityAddress);

      toast({
        title: "Identity Created Successfully",
        description: "Your identity contract has been deployed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy identity contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleConnectIdentity = async () => {
    if (!identityAddress) return;

    try {
      // Simulate connecting to identity
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsConnected(true);

      toast({
        title: "Identity Connected",
        description: "Successfully connected to your identity contract",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to identity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create Identity Contract
          </CardTitle>
          <CardDescription>
            Deploy your on-chain identity for ERC-3643 compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {EDUCATIONAL_MESSAGES.IDENTITY_REQUIRED}
            </p>
          </div>

          {!identityAddress ? (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <h4 className="font-medium mb-2">
                  What is an Identity Contract?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stores your claims and verification status</li>
                  <li>• Required for all ERC-3643 token interactions</li>
                  <li>• Links your wallet to compliance data</li>
                  <li>• Enables regulated token transfers</li>
                </ul>
              </div>

              <Button
                onClick={handleDeployIdentity}
                className="w-full"
                variant="default"
                disabled={isDeploying || !address}
              >
                {isDeploying ? "Deploying..." : "Deploy Identity Contract"}
              </Button>

              {!address && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to deploy an identity
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-success bg-success/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">
                    Identity Deployed
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Contract Address:</strong>
                  </p>
                  <Badge variant="outline" className="font-mono text-xs">
                    {formatAddress(identityAddress)}
                  </Badge>
                </div>
              </div>

              {!isConnected && (
                <Button
                  onClick={handleConnectIdentity}
                  className="w-full"
                  variant="default"
                >
                  Connect to Identity
                </Button>
              )}

              {isConnected && (
                <div className="p-4 rounded-lg border border-success bg-success/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">
                      Connected to Identity
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Identity Status</CardTitle>
          <CardDescription>
            Current state of your ERC-3643 identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Wallet Connected</span>
              <Badge variant={address ? "default" : "secondary"}>
                {address ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Identity Contract</span>
              <Badge variant={identityAddress ? "default" : "secondary"}>
                {identityAddress ? "Deployed" : "Not Deployed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Identity Connected</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Registry Status</span>
              <Badge variant="secondary">Not Registered</Badge>
            </div>
          </div>

          {identityAddress && (
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a
                  href={`https://etherscan.io/address/${identityAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Etherscan
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
