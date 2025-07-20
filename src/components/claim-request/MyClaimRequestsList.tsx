import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Shield,
  FileCheck,
  MapPin,
  Building,
  RefreshCw,
} from "lucide-react";
import { useAccount, useContractRead } from "wagmi";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import { CONTRACT_ADDRESSES } from "@/lib/config";

const IdentityAddress = CONTRACT_ADDRESSES.IDENTITY_ADDRESS as `0x${string}`;
const ClaimTopicAddress =
  CONTRACT_ADDRESSES.CLAIM_TOPIC_REGISTRY_ADDRESS as `0x${string}`;

interface ClaimRequest {
  id: string;
  claimType: string;
  issuerAddress: string;
  status: string;
}

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

export function MyClaimRequestsList() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { address } = useAccount();

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
    functionName: "getRequestsByUser",
    args: [address],
    watch: true,
  });

  console.log("data", data);
  const requests = useMemo(() => {
    if (!data || topics.length === 0) return [];
    const [ids, issuerAddresses, topicIds, statuses] = data as [
      bigint[],
      string[],
      bigint[],
      boolean[]
    ];

    return ids.map((id, index) => {
      const topicId = topicIds[index].toString();
      const topic = topics.find((t) => t.id === topicId);
      const claimType = topic ? topic.name : "Unknown";
      const statusValue = statuses[index];
      const status = statusValue === false ? "pending" : "approved";

      return {
        id: id.toString(),
        issuerAddress: issuerAddresses[index],
        claimType,
        status,
      };
    });
  }, [data, topics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
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

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Claim Requests Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't requested any claims yet. Use the "Request Claim" button
            to submit your first identity verification request.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Claim Requests</h3>
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

      <div className="space-y-3">
        {requests.map((request) => {
          const ClaimIcon =
            claimTypeIcons[request.claimType.toLowerCase()] || Shield;

          return (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ClaimIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {request.claimType}
                      </CardTitle>
                      {/* <p className="text-sm text-muted-foreground">
                        Requested {formatTimestamp(request.timestamp)}
                      </p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Issuer Address</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {request.issuerAddress.slice(0, 6)}...
                      {request.issuerAddress.slice(-4)}
                    </p>
                  </div>

                  {/* {request.message && (
                    <div>
                      <p className="text-sm font-medium">Message</p>
                      <p className="text-sm text-muted-foreground">
                        {request.message}
                      </p>
                    </div>
                  )} */}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
