import { useEffect, useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { useToast } from "@/hooks/use-toast";
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
  const [currentPage, setCurrentPage] = useState<PageType>("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (walletAddress === Admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
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
        // setWatrBalance(parseFloat(data?.formatted || "0").toFixed(4));
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

  return (
    <div className="min-h-screen bg-background">
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
