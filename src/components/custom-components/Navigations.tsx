import { Shield, Users, Coins, Settings, Wallet, LogOut } from "lucide-react";
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
                    variant="outline"
                    className="bg-compliance text-compliance-foreground"
                  >
                    Admin
                  </Badge>
                )}
                <p className="text-sm font-mono text-gray-800">
                  {address.slice(0, 8)}...{address.slice(-6)}
                </p>
                <button
                  onClick={onConnect}
                  className="px-4 py-2 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ) : null}

            {!isConnected && (
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
