/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, User, FileText, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContractRead, useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import IdentityRegistryABI from "../../../contracts-abi-files/IdentityRegistryABI.json";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";

const IdentityRegistryAddress = "0x8D8f2d83bC5d6aB4Bf4A1F8f7b92b6e3A2f4c8e1"; // Replace with actual address

interface RegisteredUser {
  walletAddress: string;
  identityAddress: string;
  countryCode: string;
  claimsCount: number;
  isKYCCompleted: boolean;
  registrationDate: string;
}

export function RegisteredUsersTab() {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { address: currentUser } = useAccount();

  // Mock data for demonstration - replace with actual contract calls
  const mockUsers: RegisteredUser[] = [
    {
      walletAddress: "0x1234567890123456789012345678901234567890",
      identityAddress: "0xa02B86A9DBE8049d53EEFD1f5560d5fF5B6c7978",
      countryCode: "US",
      claimsCount: 2,
      isKYCCompleted: true,
      registrationDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      walletAddress: "0x2345678901234567890123456789012345678901",
      identityAddress: "0xb13B97C9DBF8060d54FFGE2f6571e6fF6C7d8989",
      countryCode: "UK",
      claimsCount: 1,
      isKYCCompleted: false,
      registrationDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
    {
      walletAddress: "0x3456789012345678901234567890123456789012",
      identityAddress: "0xc24C08E10EC9071e55GGDF3f7682f7fF7D8e9A90",
      countryCode: "DE",
      claimsCount: 3,
      isKYCCompleted: true,
      registrationDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  useEffect(() => {
    // Initialize with mock data
    setRegisteredUsers(mockUsers);
  }, []);

  const handleRefreshUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Users Refreshed",
        description: "Successfully fetched latest user registrations",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to fetch user registrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUserDetails = (user: RegisteredUser) => {
    // Implement user details modal or navigation
    toast({
      title: "User Details",
      description: `Viewing details for ${user.walletAddress.slice(0, 8)}...`,
      variant: "default",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getKYCStatusBadge = (isCompleted: boolean) => {
    return isCompleted ? (
      <Badge className="bg-success/20 text-success-foreground">
        <CheckCircle className="h-3 w-3 mr-1" />
        KYC Complete
      </Badge>
    ) : (
      <Badge variant="destructive">
        <Clock className="h-3 w-3 mr-1" />
        KYC Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registered Users</h2>
          <p className="text-muted-foreground">
            Review user registrations and KYC status
          </p>
        </div>
        <Button
          onClick={handleRefreshUsers}
          variant="outline"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {registeredUsers.map((user, index) => (
          <Card key={index} className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User #{index + 1}
                </CardTitle>
                {getKYCStatusBadge(user.isKYCCompleted)}
              </div>
              <CardDescription>
                Registered on {formatDate(user.registrationDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Wallet Address</h4>
                  <Badge variant="outline" className="text-xs font-mono">
                    {formatAddress(user.walletAddress)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Identity Contract</h4>
                  <Badge variant="outline" className="text-xs font-mono">
                    {formatAddress(user.identityAddress)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Country</h4>
                  <Badge variant="secondary" className="text-xs">
                    {user.countryCode}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Claims Count</h4>
                  <Badge variant="secondary" className="text-xs">
                    {user.claimsCount} claims
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleViewUserDetails(user)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Details
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-2"
                  disabled={!user.isKYCCompleted}
                >
                  <CheckCircle className="h-4 w-4" />
                  Issue Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {registeredUsers.length === 0 && (
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Registered Users</h3>
              <p className="text-muted-foreground">
                No users have registered for identity verification yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}