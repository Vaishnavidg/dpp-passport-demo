import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Users,
  FileText,
  Coins,
  CheckCircle,
  XCircle,
  Plus,
  User,
  Building,
} from "lucide-react";
import Navbar from "@/components/custom-components/Navbar";
import { Navigation } from "@/components/custom-components/Navigations";
import { AdminDashboard } from "./admin-dashboard/index";
import { UserDashboard } from "./user-dashboard";
import Overview from "./Overview";

interface ClaimTopic {
  id: number;
  name: string;
}

interface TrustedIssuer {
  address: string;
  authorizedTopics: number[];
}

interface UserIdentity {
  walletAddress: string;
  identityAddress: string;
  countryCode: string;
}

interface Claim {
  userAddress: string;
  topicId: number;
  issuer: string;
  expiryDate: string;
  isValid: boolean;
}
type PageType = "overview" | "admin" | "user";

const Admin = "0x35C6e706EE23CD898b2C15fEB20f0fE726E734D2";

const Index = () => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [watrBalance, setWatrBalance] = useState("0");
  const [activeSection, setActiveSection] = useState("send");
  const [currentPage, setCurrentPage] = useState<PageType>("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (walletAddress === Admin) {
      setIsAdmin(true);
    }
  }, [walletAddress]);

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const { isConnected, address } = useAccount();
  const { data } = useBalance({
    address: address,
  });

  // ****Connect wallet and fetch balance and address.*******
  useEffect(() => {
    const handleConnection = async () => {
      if (isConnected && address) {
        setWalletAddress(address);
        setWatrBalance(parseFloat(data?.formatted || "0").toFixed(4));
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to wallet",
        });
      }
    };
    handleConnection();
  }, [isConnected, address, data]);

  const connectWallet = async () => {
    try {
      if (isConnected) {
        await disconnect();
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected from wallet",
        });
      } else {
        await open();
      }
    } catch (error) {
      console.error("Error managing wallet connection:", error);
      toast({
        title: "Operation Failed",
        description: isConnected
          ? "Failed to disconnect wallet. Please try again."
          : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "admin":
        return isConnected && isAdmin ? <AdminDashboard /> : <ERC3643Demo />;
      case "user":
        return isConnected ? <UserDashboard /> : <ERC3643Demo />;
      default:
        return <ERC3643Demo />;
    }
  };

  const ERC3643Demo = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl border border-primary/20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
          ERC-3643 Digital Product Passport Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Experience compliant token transfers through identity verification and claims management
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Identity-Based Compliance
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            Claims Management
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Coins className="w-4 h-4 mr-2" />
            Controlled Transfers
          </Badge>
        </div>
      </div>

      {/* Tabs Implementation */}
      <Tabs defaultValue="claim-topics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="claim-topics" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Claim Topics
          </TabsTrigger>
          <TabsTrigger value="trusted-issuers" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Trusted Issuers
          </TabsTrigger>
          <TabsTrigger value="user-identity" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            User Identity
          </TabsTrigger>
          <TabsTrigger value="issue-claims" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Issue Claims
          </TabsTrigger>
          <TabsTrigger value="token-transfer" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Token Transfer
          </TabsTrigger>
        </TabsList>

        {/* Claim Topics Tab */}
        <TabsContent value="claim-topics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Claim Topics Setup
              </CardTitle>
              <CardDescription>
                Define verification requirements (KYC, Sustainability, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-name">Topic Name</Label>
                  <Input
                    id="topic-name"
                    placeholder="e.g., KYC Verification"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-id">Topic ID</Label>
                  <Input
                    id="topic-id"
                    placeholder="e.g., 1"
                    type="number"
                    value={newTopicId}
                    onChange={(e) => setNewTopicId(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addClaimTopic} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Claim Topic
              </Button>
            </CardContent>
          </Card>

          {/* Claim Topics List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Claim Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {claimTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{topic.name}</span>
                      <Badge variant="outline" className="ml-2">
                        ID: {topic.id}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trusted Issuers Tab */}
        <TabsContent value="trusted-issuers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Trusted Issuers Setup
              </CardTitle>
              <CardDescription>
                Register entities that can issue verification claims
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issuer-address">Issuer Address</Label>
                <Input
                  id="issuer-address"
                  placeholder="0x..."
                  value={newIssuerAddress}
                  onChange={(e) => setNewIssuerAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Authorized Topics</Label>
                <div className="grid grid-cols-2 gap-2">
                  {claimTopics.map((topic) => (
                    <label key={topic.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([...selectedTopics, topic.id]);
                          } else {
                            setSelectedTopics(
                              selectedTopics.filter((id) => id !== topic.id)
                            );
                          }
                        }}
                      />
                      <span className="text-sm">{topic.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={addTrustedIssuer} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Trusted Issuer
              </Button>
            </CardContent>
          </Card>

          {/* Trusted Issuers List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Trusted Issuers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trustedIssuers.map((issuer, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="font-mono text-sm">{issuer.address}</div>
                    <div className="flex flex-wrap gap-1">
                      {issuer.authorizedTopics.map((topicId) => {
                        const topic = claimTopics.find((t) => t.id === topicId);
                        return (
                          <Badge key={topicId} variant="secondary">
                            {topic?.name || `Topic ${topicId}`}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Identity Tab */}
        <TabsContent value="user-identity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Identity Setup
              </CardTitle>
              <CardDescription>
                Register user identities for compliance verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-wallet">User Wallet Address</Label>
                <Input
                  id="user-wallet"
                  placeholder="0x..."
                  value={newUserWallet}
                  onChange={(e) => setNewUserWallet(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country-code">Country Code</Label>
                <Input
                  id="country-code"
                  placeholder="US, DE, JP, etc."
                  value={newUserCountry}
                  onChange={(e) => setNewUserCountry(e.target.value)}
                />
              </div>
              <Button onClick={registerIdentity} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Register Identity
              </Button>
            </CardContent>
          </Card>

          {/* User Identities List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered User Identities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userIdentities.map((user, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-lg"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">Wallet</div>
                      <div className="font-mono text-sm">{user.walletAddress}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Identity</div>
                      <div className="font-mono text-sm">{user.identityAddress}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Country</div>
                      <Badge variant="outline">{user.countryCode}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issue Claims Tab */}
        <TabsContent value="issue-claims" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Issue Claims
              </CardTitle>
              <CardDescription>
                Issue verification claims to registered users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claim-user">User Address</Label>
                <Input
                  id="claim-user"
                  placeholder="0x..."
                  value={claimUserAddress}
                  onChange={(e) => setClaimUserAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="claim-topic">Claim Topic</Label>
                <select
                  id="claim-topic"
                  className="w-full p-2 border rounded-md"
                  value={claimTopicId}
                  onChange={(e) => setClaimTopicId(parseInt(e.target.value))}
                >
                  {claimTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name} (ID: {topic.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="claim-expiry">Expiry Date</Label>
                <Input
                  id="claim-expiry"
                  type="date"
                  value={claimExpiryDate}
                  onChange={(e) => setClaimExpiryDate(e.target.value)}
                />
              </div>
              <Button onClick={issueClaim} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Issue Claim
              </Button>
            </CardContent>
          </Card>

          {/* Claims List */}
          <Card>
            <CardHeader>
              <CardTitle>Issued Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claims.map((claim, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">User</div>
                      <div className="font-mono text-sm">{claim.userAddress}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Topic</div>
                      <div className="text-sm">
                        {claimTopics.find((t) => t.id === claim.topicId)?.name ||
                          `Topic ${claim.topicId}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Expires</div>
                      <div className="text-sm">{claim.expiryDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="flex items-center gap-1">
                        {claim.isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {claim.isValid ? "Valid" : "Expired"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Transfer Tab */}
        <TabsContent value="token-transfer" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                DPP Token Transfer
              </CardTitle>
              <CardDescription>
                Transfer DPP tokens between compliant users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transfer-from">From Address</Label>
                  <Input
                    id="transfer-from"
                    placeholder="0x..."
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-to">To Address</Label>
                  <Input
                    id="transfer-to"
                    placeholder="0x..."
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transfer-amount">Amount</Label>
                  <Input
                    id="transfer-amount"
                    placeholder="100"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={checkCompliance} variant="outline" className="flex-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Check Compliance
                </Button>
                <Button onClick={executeTransfer} className="flex-1">
                  <Coins className="w-4 h-4 mr-2" />
                  Execute Transfer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Both users must have registered identities
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Both users must have valid (non-expired) claims
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Claims must be issued by authorized trusted issuers
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  ////************************************************************** */
  // State for all sections
  const [claimTopics, setClaimTopics] = useState<ClaimTopic[]>([
    { id: 1, name: "KYC Verification" },
    { id: 100, name: "Sustainability Certificate" },
  ]);
  const [trustedIssuers, setTrustedIssuers] = useState<TrustedIssuer[]>([]);
  const [userIdentities, setUserIdentities] = useState<UserIdentity[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  // Form states
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicId, setNewTopicId] = useState("");
  const [newIssuerAddress, setNewIssuerAddress] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [newUserWallet, setNewUserWallet] = useState("");
  const [newUserCountry, setNewUserCountry] = useState("");
  const [claimUserAddress, setClaimUserAddress] = useState("");
  const [claimTopicId, setClaimTopicId] = useState<number>(1);
  const [claimExpiryDate, setClaimExpiryDate] = useState("");
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const addClaimTopic = () => {
    if (!newTopicName || !newTopicId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const id = parseInt(newTopicId);
    if (claimTopics.find((topic) => topic.id === id)) {
      toast({
        title: "Error",
        description: "Topic ID already exists",
        variant: "destructive",
      });
      return;
    }

    setClaimTopics([...claimTopics, { id, name: newTopicName }]);
    setNewTopicName("");
    setNewTopicId("");
    toast({ title: "Success", description: "Claim topic added successfully" });
  };

  const addTrustedIssuer = () => {
    if (!newIssuerAddress || selectedTopics.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setTrustedIssuers([
      ...trustedIssuers,
      {
        address: newIssuerAddress,
        authorizedTopics: [...selectedTopics],
      },
    ]);
    setNewIssuerAddress("");
    setSelectedTopics([]);
    toast({
      title: "Success",
      description: "Trusted issuer added successfully",
    });
  };

  const registerIdentity = () => {
    if (!newUserWallet || !newUserCountry) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const identityAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    setUserIdentities([
      ...userIdentities,
      {
        walletAddress: newUserWallet,
        identityAddress,
        countryCode: newUserCountry,
      },
    ]);
    setNewUserWallet("");
    setNewUserCountry("");
    toast({
      title: "Success",
      description: "User identity registered successfully",
    });
  };

  const issueClaim = () => {
    if (!claimUserAddress || !claimExpiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const user = userIdentities.find(
      (u) => u.walletAddress === claimUserAddress
    );
    if (!user) {
      toast({
        title: "Error",
        description: "User identity not found",
        variant: "destructive",
      });
      return;
    }

    const issuer = trustedIssuers.find((i) =>
      i.authorizedTopics.includes(claimTopicId)
    );
    if (!issuer) {
      toast({
        title: "Error",
        description: "No authorized issuer found for this topic",
        variant: "destructive",
      });
      return;
    }

    const isValid = new Date(claimExpiryDate) > new Date();
    setClaims([
      ...claims,
      {
        userAddress: claimUserAddress,
        topicId: claimTopicId,
        issuer: issuer.address,
        expiryDate: claimExpiryDate,
        isValid,
      },
    ]);

    setClaimUserAddress("");
    setClaimExpiryDate("");
    toast({ title: "Success", description: "Claim issued successfully" });
  };

  const checkCompliance = () => {
    if (!transferFrom || !transferTo) {
      toast({
        title: "Error",
        description: "Please fill in all transfer fields",
        variant: "destructive",
      });
      return;
    }

    const fromUser = userIdentities.find(
      (u) => u.walletAddress === transferFrom
    );
    const toUser = userIdentities.find((u) => u.walletAddress === transferTo);

    if (!fromUser || !toUser) {
      toast({
        title: "Compliance Check Failed",
        description: "One or both users don't have registered identities",
        variant: "destructive",
      });
      return;
    }

    const fromClaims = claims.filter(
      (c) => c.userAddress === transferFrom && c.isValid
    );
    const toClaims = claims.filter(
      (c) => c.userAddress === transferTo && c.isValid
    );

    if (fromClaims.length === 0 || toClaims.length === 0) {
      toast({
        title: "Compliance Check Failed",
        description: "Both users need valid claims for transfer",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Compliance Check Passed",
      description: "Transfer is authorized!",
      variant: "default",
    });
  };

  const executeTransfer = () => {
    checkCompliance();
    // In a real app, this would execute the token transfer
    toast({
      title: "Transfer Executed",
      description: `Successfully transferred ${transferAmount} DPP tokens`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar
        isConnected={isConnected}
        connectWallet={connectWallet}
        walletAddress={walletAddress}
        watrBalance={watrBalance}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      /> */}

      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isConnected={isConnected}
        onConnect={connectWallet}
        address={walletAddress}
        isAdmin={isAdmin}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-2">
          This demo showcases how <strong>ERC-3643</strong> enables compliant
          token transfers through identity verification and claims management.
        </p>
        <p className="text-sm">
          Perfect for supply chain transparency, regulatory compliance, and
          enterprise tokenization.
        </p>
      </div>
    </div>
  );
};

export default Index;
