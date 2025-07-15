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
