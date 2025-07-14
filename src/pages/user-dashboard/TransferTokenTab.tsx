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
import { Badge } from "@/components/ui/badge";
import {
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { EDUCATIONAL_MESSAGES } from "@/lib/config";

interface TokenTransfer {
  to: string;
  amount: string;
  timestamp: string;
  status: "success" | "failed";
  reason?: string;
}

export function TransferTokenTab() {
  const [transferForm, setTransferForm] = useState({ to: "", amount: "" });
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [tokenBalance] = useState(150); // Mock token balance
  const { address } = useAccount();
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!transferForm.to || !transferForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please provide both recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(transferForm.amount);
    if (amount > tokenBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough tokens for this transfer",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);

    try {
      // Simulate compliance checks
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate random compliance failure for demo
      const complianceCheck = Math.random() > 0.3; // 70% success rate for demo

      if (!complianceCheck) {
        const transfer: TokenTransfer = {
          to: transferForm.to,
          amount: transferForm.amount,
          timestamp: new Date().toISOString(),
          status: "failed",
          reason: "Recipient lacks valid claims or identity",
        };

        setTransfers([transfer, ...transfers]);

        toast({
          title: "Transfer Blocked",
          description: EDUCATIONAL_MESSAGES.TRANSFER_BLOCKED,
          variant: "destructive",
        });
      } else {
        // Simulate successful transfer
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const transfer: TokenTransfer = {
          to: transferForm.to,
          amount: transferForm.amount,
          timestamp: new Date().toISOString(),
          status: "success",
        };

        setTransfers([transfer, ...transfers]);
        setTransferForm({ to: "", amount: "" });

        toast({
          title: "Transfer Successful",
          description: `${amount} tokens transferred successfully`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
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
      <div className="space-y-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {tokenBalance}
              </div>
              <p className="text-sm text-muted-foreground">
                ERC-3643 Compliant Tokens
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Transfer Tokens
            </CardTitle>
            <CardDescription>
              Transfer tokens to other eligible users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                {EDUCATIONAL_MESSAGES.COMPLIANCE_CHECK}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={transferForm.to}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, to: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  max={tokenBalance}
                  value={transferForm.amount}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, amount: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum: {tokenBalance} tokens
                </p>
              </div>

              <Button
                onClick={handleTransfer}
                className="w-full"
                variant="default"
                disabled={isTransferring || !address}
              >
                {isTransferring ? "Processing Transfer..." : "Transfer Tokens"}
              </Button>

              {!address && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to transfer tokens
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Recent token transfer attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transfers.map((transfer, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          transfer.status === "success"
                            ? "bg-success/20 text-success-foreground"
                            : "bg-destructive/20 text-destructive-foreground"
                        }
                      >
                        {transfer.status === "success" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {transfer.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {transfer.amount} tokens
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(transfer.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">To:</span>
                    <Badge variant="outline" className="text-xs">
                      {formatAddress(transfer.to)}
                    </Badge>
                  </div>

                  {transfer.reason && (
                    <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                      <AlertTriangle className="h-3 w-3 text-destructive mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        {transfer.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {transfers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transfers yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
