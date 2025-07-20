import { useState } from "react";
import { Navigation } from "@/components/custom-components/Navigations";
import { AdminDashboard } from "./admin-dashboard/index";
import { UserDashboard } from "./user-dashboard";
import { IssuerDashboard } from "./issuer-dashboard";
import Overview from "./Overview";
import { useWalletConnection } from "@/hooks/use-wallet-connection";

type PageType = "overview" | "admin" | "user" | "issuer";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("overview");
  const { 
    walletAddress, 
    isConnected, 
    isAdmin, 
    isTrustedIssuer, 
    connectWallet 
  } = useWalletConnection();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "admin":
        return isConnected && isAdmin ? <AdminDashboard /> : <Overview />;
      case "issuer":
        return isConnected && isTrustedIssuer ? (
          <IssuerDashboard />
        ) : (
          <Overview />
        );
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
        isTrustedIssuer={isTrustedIssuer}
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
