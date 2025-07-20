import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Shield,
  FileCheck,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useContractRead } from "wagmi";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import IdentityRegistryABI from "../../../contracts-abi-files/IdentityRegistryABI.json";

const IdentityAddress = "0x66B7642b399A6c72b72129E8F1Af35DbcBf36b7d";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";
const IdentityRegistryAddress = "0x9e1EFE110aC3615ad3B669CC6a424e24e41bFd05";

interface RegisteredUser {
  walletAddress: string;
  identityAddress: string;
  countryCode: string;
  claimsCount: number;
  isKYCCompleted: boolean;
  registrationDate: string;
}

interface ClaimRequest {
  id: string;
  requesterAddress: string;
  claimType: string;
  status: "pending" | "approved" | "rejected";
  identityAddress: string;
  countryCode: string;
  registrationDate: string;
}

const formatAddress = (addr: string) => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const claimTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  kyc: User,
  aml: Shield,
  "proof-of-residency": MapPin,
  "business-license": Building,
  "identity-document": FileCheck,
};

const claimTypeNames: Record<string, string> = {
  kyc: "KYC Verification",
  aml: "AML Compliance",
  "proof-of-residency": "Proof of Residency",
  "business-license": "Business License",
  "identity-document": "Identity Document",
};

export function ClaimRequestsTab() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { address } = useAccount();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Address Copied",
        description: "Address has been copied to clipboard",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };
  const getStatusIcon = (status: ClaimRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ClaimRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-warning border-warning">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-success border-success">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="text-destructive border-destructive"
          >
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const UsersData = useContractRead({
    address: IdentityRegistryAddress,
    abi: IdentityRegistryABI,
    functionName: "getAllUsers",
    watch: true,
  });

  const registeredUsers: RegisteredUser[] = useMemo(() => {
    if (
      Array.isArray(UsersData.data) &&
      UsersData.data.length === 3 &&
      Array.isArray(UsersData.data[0])
    ) {
      const [wallets, identities, countries] = UsersData.data;

      return wallets.map((wallet: string, index: number) => ({
        walletAddress: wallet,
        identityAddress: identities[index],
        countryCode: countries[index]?.toString() || "N/A",
        claimsCount: 0, // You can update this later by reading Identity contract
        isKYCCompleted: false, // You can dynamically check this using isClaimValid
        registrationDate: new Date().toISOString(), // Optional placeholder
      }));
    }
    return [];
  }, [UsersData.data]);

  const { data: topicList } = useContractRead({
    address: ClaimTopicAddress,
    abi: ClaimTopicsABI,
    functionName: "getClaimTopicsWithNamesAndDescription",
    watch: true,
  });

  const topics = useMemo(() => {
    if (!topicList) return [];
    const [ids, names, descriptions] = topicList as [
      bigint[],
      string[],
      string[]
    ];
    return ids.map((id, index) => ({
      id: id.toString(),
      name: names[index],
      description: descriptions[index],
    }));
  }, [topicList]);

  const { data } = useContractRead({
    address: IdentityAddress,
    abi: IdentityABI,
    functionName: "getRequestsForIssuer",
    args: [address],
    watch: true,
  });

  const requests: ClaimRequest[] = useMemo(() => {
    if (!data || topics.length === 0) return [];
    const [ids, requesterAddress, topicIds, statuses] = data as [
      bigint[],
      string[],
      bigint[],
      boolean[]
    ];

    return ids.map((id, index) => {
      const topicId = topicIds[index].toString();
      const topic = topics.find((t) => t.id === topicId);
      const user = registeredUsers.find(
        (user) => user.walletAddress === requesterAddress[index]
      );
      const claimType = topic ? topic.name : "Unknown";
      const statusValue = statuses[index];
      const status = statusValue === false ? "pending" : "approved";

      return {
        id: id.toString(),
        requesterAddress: requesterAddress[index],
        claimType,
        status,
        identityAddress: user.identityAddress,
        countryCode: user.countryCode,
        registrationDate: user.registrationDate,
      };
    });
  }, [data, topics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Claim Requests
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review and process identity verification requests from users
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground">
                Claim requests from users will appear here for your review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.length > 0 && (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RequestId</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Claim Type</TableHead>
                        <TableHead>Identity Address</TableHead>
                        <TableHead>Registered Date</TableHead>
                        <TableHead>Country Code</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => {
                        const ClaimIcon =
                          claimTypeIcons[request.claimType] || Shield;

                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">
                              {request.id}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {request.requesterAddress.slice(0, 6)}...
                              {request.requesterAddress.slice(-4)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ClaimIcon className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  {claimTypeNames[request.claimType] ||
                                    request.claimType}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  {formatAddress(request.identityAddress)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(request.identityAddress)
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  {formatDate(request.registrationDate)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {" "}
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  {request.countryCode}
                                </Badge>
                              </div>
                            </TableCell>

                            <TableCell className="text-right space-x-2">
                              <div className="flex items-end gap-2">
                                {getStatusIcon(request.status)}
                                {getStatusBadge(request.status)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
