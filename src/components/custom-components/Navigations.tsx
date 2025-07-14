import { Shield, Users, Coins, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  currentPage: "overview" | "admin" | "user";
  onPageChange: (page: "overview" | "admin" | "user") => void;
  isConnected: boolean;
  onConnect: () => void;
  address?: string;
  isAdmin?: boolean;
}

export const Navigation = ({
  currentPage,
  onPageChange,
  isConnected,
  onConnect,
  address,
  isAdmin = false,
}: NavigationProps) => {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                ERC-3643 Playground
              </span>
            </div>

            <div className="hidden md:flex space-x-4">
              <Button
                variant={currentPage === "overview" ? "default" : "ghost"}
                onClick={() => onPageChange("overview")}
                size="sm"
              >
                Overview
              </Button>

              {isConnected && isAdmin && (
                <Button
                  variant={currentPage === "admin" ? "default" : "ghost"}
                  onClick={() => onPageChange("admin")}
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}

              {isConnected && (
                <Button
                  variant={currentPage === "user" ? "default" : "ghost"}
                  onClick={() => onPageChange("user")}
                  size="sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Badge
                    variant="secondary"
                    className="bg-compliance text-compliance-foreground"
                  >
                    Admin
                  </Badge>
                )}
                <Badge variant="outline" className="font-mono text-xs">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </Badge>
              </div>
            ) : (
              <Button
                onClick={onConnect}
                className="bg-primary hover:bg-primary/90"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
