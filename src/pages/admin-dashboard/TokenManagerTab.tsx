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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  Send,
  Snowflake,
  Unlock,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenTransaction {
  type: "mint" | "transfer" | "freeze" | "unfreeze";
  userAddress: string;
  amount?: string;
  timestamp: string;
  status: "success" | "failed";
}

export function TokenManagerTab() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [mintForm, setMintForm] = useState({ address: "", amount: "" });
  const [transferForm, setTransferForm] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [freezeForm, setFreezeForm] = useState({ address: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMintTokens = async () => {
    if (!mintForm.address || !mintForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please provide both recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transaction: TokenTransaction = {
        type: "mint",
        userAddress: mintForm.address,
        amount: mintForm.amount,
        timestamp: new Date().toISOString(),
        status: "success",
      };

      setTransactions([transaction, ...transactions]);
      setMintForm({ address: "", amount: "" });

      toast({
        title: "Tokens Minted Successfully",
        description: `${
          mintForm.amount
        } tokens minted to ${mintForm.address.slice(
          0,
          6
        )}...${mintForm.address.slice(-4)}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForceTransfer = async () => {
    if (!transferForm.from || !transferForm.to || !transferForm.amount) {
      toast({
        title: "Missing Information",
        description: "Please provide from address, to address, and amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transaction: TokenTransaction = {
        type: "transfer",
        userAddress: `${transferForm.from} → ${transferForm.to}`,
        amount: transferForm.amount,
        timestamp: new Date().toISOString(),
        status: "success",
      };

      setTransactions([transaction, ...transactions]);
      setTransferForm({ from: "", to: "", amount: "" });

      toast({
        title: "Force Transfer Complete",
        description: "Compliance override transfer executed successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFreezeUser = async () => {
    if (!freezeForm.address) {
      toast({
        title: "Missing Address",
        description: "Please provide user address to freeze",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const transaction: TokenTransaction = {
        type: "freeze",
        userAddress: freezeForm.address,
        timestamp: new Date().toISOString(),
        status: "success",
      };

      setTransactions([transaction, ...transactions]);
      setFreezeForm({ address: "" });

      toast({
        title: "User Frozen",
        description: `User ${freezeForm.address.slice(
          0,
          6
        )}...${freezeForm.address.slice(-4)} has been frozen`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Freeze Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (addr.includes("→")) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Coins className="h-4 w-4" />;
      case "transfer":
        return <Send className="h-4 w-4" />;
      case "freeze":
        return <Snowflake className="h-4 w-4" />;
      case "unfreeze":
        return <Unlock className="h-4 w-4" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "mint":
        return "bg-success/20 text-success-foreground";
      case "transfer":
        return "bg-primary/20 text-primary-foreground";
      case "freeze":
        return "bg-destructive/20 text-destructive-foreground";
      case "unfreeze":
        return "bg-warning/20 text-warning-foreground";
      default:
        return "bg-secondary/20 text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mint" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
          <TabsTrigger value="mint">Mint Tokens</TabsTrigger>
          <TabsTrigger value="transfer">Force Transfer</TabsTrigger>
          <TabsTrigger value="freeze">Freeze/Unfreeze</TabsTrigger>
        </TabsList>

        <TabsContent value="mint">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Mint ERC-3643 Tokens
                </CardTitle>
                <CardDescription>
                  Mint tokens to eligible users with valid identity and claims
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Only users with verified identity and valid claims can
                    receive tokens. The compliance contract automatically
                    validates eligibility.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="mint-address">Recipient Address</Label>
                    <Input
                      id="mint-address"
                      placeholder="0x..."
                      value={mintForm.address}
                      onChange={(e) =>
                        setMintForm({ ...mintForm, address: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="mint-amount">Amount</Label>
                    <Input
                      id="mint-amount"
                      type="number"
                      placeholder="100"
                      value={mintForm.amount}
                      onChange={(e) =>
                        setMintForm({ ...mintForm, amount: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleMintTokens}
                    className="w-full"
                    variant="default"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Minting..." : "Mint Tokens"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transfer">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Force Transfer
                </CardTitle>
                <CardDescription>
                  Override compliance checks for emergency transfers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Force transfers bypass normal compliance checks. Use only
                    for emergency situations or testing purposes.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="transfer-from">From Address</Label>
                    <Input
                      id="transfer-from"
                      placeholder="0x..."
                      value={transferForm.from}
                      onChange={(e) =>
                        setTransferForm({
                          ...transferForm,
                          from: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="transfer-to">To Address</Label>
                    <Input
                      id="transfer-to"
                      placeholder="0x..."
                      value={transferForm.to}
                      onChange={(e) =>
                        setTransferForm({ ...transferForm, to: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="transfer-amount">Amount</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      placeholder="50"
                      value={transferForm.amount}
                      onChange={(e) =>
                        setTransferForm({
                          ...transferForm,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleForceTransfer}
                    className="w-full"
                    variant="warning"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Force Transfer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="freeze">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5" />
                  Freeze User
                </CardTitle>
                <CardDescription>
                  Freeze or unfreeze user token operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Frozen users cannot transfer or receive tokens until
                    unfrozen. Use for compliance violations or suspicious
                    activity.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="freeze-address">User Address</Label>
                    <Input
                      id="freeze-address"
                      placeholder="0x..."
                      value={freezeForm.address}
                      onChange={(e) =>
                        setFreezeForm({
                          ...freezeForm,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleFreezeUser}
                      variant="destructive"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Freeze User"}
                    </Button>
                    <Button
                      onClick={handleFreezeUser}
                      variant="success"
                      disabled={isProcessing}
                    >
                      Unfreeze User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Token management operations history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getTransactionColor(tx.type)}>
                      {getTransactionIcon(tx.type)}
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        {formatAddress(tx.userAddress)}
                      </p>
                      {tx.amount && (
                        <p className="text-xs text-muted-foreground">
                          Amount: {tx.amount}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </p>
                    <Badge
                      variant={
                        tx.status === "success" ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
