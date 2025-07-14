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
        return isConnected && isAdmin ? <AdminDashboard /> : <Overview />;
      case "user":
        return isConnected ? <UserDashboard /> : <Overview />;
      default:
        return <Overview />;
    }
  };

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

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="topics">Claim Topics</TabsTrigger>
            <TabsTrigger value="issuers">Trusted Issuers</TabsTrigger>
            <TabsTrigger value="identity">User Identity</TabsTrigger>
            <TabsTrigger value="claims">Issue Claims</TabsTrigger>
            <TabsTrigger value="transfer">Token Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-accent">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  🧩 Claim Topics Setup
                </CardTitle>
                <CardDescription>
                  Define claim types that represent different compliance
                  requirements (KYC, Sustainability, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="topicName">Topic Name</Label>
                    <Input
                      id="topicName"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="e.g., KYC Verification"
                    />
                  </div>
                  <div>
                    <Label htmlFor="topicId">Topic ID</Label>
                    <Input
                      id="topicId"
                      type="number"
                      value={newTopicId}
                      onChange={(e) => setNewTopicId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addClaimTopic} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Topic
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Current Topics:</h4>
                  {claimTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span>
                        <strong>ID {topic.id}:</strong> {topic.name}
                      </span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issuers" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-accent">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-primary" />
                  🛡️ Trusted Issuers Setup
                </CardTitle>
                <CardDescription>
                  Register entities that can issue claims (KYC providers,
                  certification bodies, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="issuerAddress">Issuer Address</Label>
                    <Input
                      id="issuerAddress"
                      value={newIssuerAddress}
                      onChange={(e) => setNewIssuerAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label>Authorized Claim Topics</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {claimTopics.map((topic) => (
                        <Badge
                          key={topic.id}
                          variant={
                            selectedTopics.includes(topic.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedTopics((prev) =>
                              prev.includes(topic.id)
                                ? prev.filter((id) => id !== topic.id)
                                : [...prev, topic.id]
                            );
                          }}
                        >
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={addTrustedIssuer} className="mb-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trusted Issuer
                </Button>

                <div className="space-y-2">
                  <h4 className="font-medium">Trusted Issuers:</h4>
                  {trustedIssuers.map((issuer, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="font-mono text-sm mb-2">
                        {issuer.address}
                      </div>
                      <div className="flex gap-2">
                        {issuer.authorizedTopics.map((topicId) => {
                          const topic = claimTopics.find(
                            (t) => t.id === topicId
                          );
                          return topic ? (
                            <Badge
                              key={topicId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identity" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-accent">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  👤 User Identity Setup
                </CardTitle>
                <CardDescription>
                  Register user identities that can participate in compliant
                  transfers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="userWallet">User Wallet Address</Label>
                    <Input
                      id="userWallet"
                      value={newUserWallet}
                      onChange={(e) => setNewUserWallet(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Input
                      id="countryCode"
                      value={newUserCountry}
                      onChange={(e) => setNewUserCountry(e.target.value)}
                      placeholder="US, DE, JP..."
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={registerIdentity} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Register Identity
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Registered Identities:</h4>
                  {userIdentities.map((user, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <strong>Wallet:</strong>{" "}
                          <span className="font-mono">
                            {user.walletAddress}
                          </span>
                        </div>
                        <div>
                          <strong>Identity:</strong>{" "}
                          <span className="font-mono">
                            {user.identityAddress}
                          </span>
                        </div>
                        <div>
                          <strong>Country:</strong> {user.countryCode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-accent">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  📝 Issue Claims
                </CardTitle>
                <CardDescription>
                  Issue compliance claims to users (simulating KYC providers,
                  certifiers, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="claimUser">User Address</Label>
                    <Input
                      id="claimUser"
                      value={claimUserAddress}
                      onChange={(e) => setClaimUserAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="claimTopic">Claim Topic</Label>
                    <select
                      id="claimTopic"
                      value={claimTopicId}
                      onChange={(e) =>
                        setClaimTopicId(parseInt(e.target.value))
                      }
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      {claimTopics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={claimExpiryDate}
                      onChange={(e) => setClaimExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={issueClaim} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Issue Claim
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Issued Claims:</h4>
                  {claims.map((claim, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <strong>User:</strong>{" "}
                            <span className="font-mono">
                              {claim.userAddress}
                            </span>
                          </div>
                          <div className="text-sm">
                            <strong>Topic:</strong>{" "}
                            {
                              claimTopics.find((t) => t.id === claim.topicId)
                                ?.name
                            }
                          </div>
                          <div className="text-sm">
                            <strong>Expires:</strong> {claim.expiryDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {claim.isValid ? (
                            <Badge variant="default" className="bg-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valid
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-accent">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  💱 Token Transfer (DPP Token)
                </CardTitle>
                <CardDescription>
                  Transfer Digital Product Passport tokens between compliant
                  users
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="transferFrom">From Address</Label>
                    <Input
                      id="transferFrom"
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="transferTo">To Address</Label>
                    <Input
                      id="transferTo"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="transferAmount">Amount</Label>
                    <Input
                      id="transferAmount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={executeTransfer}
                      variant="success"
                      className="w-full"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Transfer Token
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="text-center">
                    <Button
                      onClick={checkCompliance}
                      variant="outline"
                      className="mb-4"
                    >
                      Check Compliance First
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Transfers are only allowed between users with valid
                      identity claims and compliance certificates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
    </div>
  );
};

export default Index;
