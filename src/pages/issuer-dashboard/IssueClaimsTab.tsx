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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Send, Info, CheckCircle, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { writeContract, readContract } from "@wagmi/core";
import { useContractRead, useSignMessage, useAccount } from "wagmi";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import TrustedIssuersABI from "../../../contracts-abi-files/TrustedIssuersABI.json";
import {
  encodePacked,
  hexToString,
  keccak256,
  stringToHex,
} from "viem";

const IdentityContractAddress = "0xa02B86A9DBE8049d53EEFD1f5560d5fF5B6c7978";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";
const TrustedIssuersRegistryAddress = "0xFAF9C47067D436ca7480bd7C3E2a85b53aC0c8E5";

const generateClaimMessage = (
  topic: number,
  userAddress: string,
  timestamp: number
): `0x${string}` => {
  const packed = encodePacked(
    ["uint256", "address", "uint256"],
    [BigInt(topic), userAddress as `0x${string}`, BigInt(timestamp)]
  );
  const hashedMessage = keccak256(packed);
  return hashedMessage;
};

interface IssuedClaim {
  userAddress: string;
  topicId: number;
  topicName: string;
  timestamp: string;
  data?: string;
  validTo?: number;
  issuer?: string;
  isValid?: boolean;
}

export function IssueClaimsTab() {
  const [newClaim, setNewClaim] = useState({
    userAddress: "",
    topicId: "",
    data: "",
    expiryDays: "365",
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [allClaims, setAllClaims] = useState<any[]>([]);
  const [isAuthorizedIssuer, setIsAuthorizedIssuer] = useState(false);
  
  const { toast } = useToast();
  const { signMessageAsync } = useSignMessage();
  const { address: currentUser } = useAccount();

  // Check if current user is a trusted issuer
  useEffect(() => {
    const checkIssuerStatus = async () => {
      if (!currentUser) return;
      
      try {
        const result = await readContract({
          address: TrustedIssuersRegistryAddress,
          abi: TrustedIssuersABI,
          functionName: "isTrustedIssuer",
          args: [currentUser],
        });
        setIsAuthorizedIssuer(result as boolean);
      } catch (error) {
        console.error("Error checking issuer status:", error);
        setIsAuthorizedIssuer(false);
      }
    };

    checkIssuerStatus();
  }, [currentUser]);

  const {
    data: rawClaims,
    isLoading,
    refetch: refetchAllClaims,
  } = useContractRead({
    address: IdentityContractAddress,
    abi: IdentityABI,
    functionName: "getAllClaims",
    watch: true,
  });

  useEffect(() => {
    const fetchClaimsWithValidity = async () => {
      if (!rawClaims) {
        setAllClaims([]);
        return;
      }

      const [topics, issuers, signatures, datas, validsTo] = rawClaims as [
        bigint[],
        string[],
        string[],
        string[],
        bigint[]
      ];

      const enrichedClaims = await Promise.all(
        topics.map(async (topic, index) => {
          const topicId = topic.toString();
          const validTo = Number(validsTo[index]);

          let isValid: boolean = false;
          try {
            const valid = await readContract({
              address: IdentityContractAddress,
              abi: IdentityABI,
              functionName: "isClaimValid",
              args: [topic],
            });
            isValid = valid as boolean;
          } catch (e) {
            console.error(`Validity check failed for topic ${topicId}`, e);
          }

          return {
            topic: topicId,
            issuer: issuers[index],
            signature: signatures[index],
            data: hexToString(datas[index] as `0x${string}`),
            validTo,
            timestamp: new Date(
              validTo * 1000 - 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            isValid,
          };
        })
      );

      // Filter claims issued by current user
      const myIssuedClaims = enrichedClaims.filter(
        claim => claim.issuer.toLowerCase() === currentUser?.toLowerCase()
      );
      setAllClaims(myIssuedClaims);
    };

    fetchClaimsWithValidity();
  }, [rawClaims, currentUser]);

  const { data: topicData } = useContractRead({
    address: ClaimTopicAddress,
    abi: ClaimTopicsABI,
    functionName: "getClaimTopicsWithNamesAndDescription",
    watch: true,
  });

  const topics = useMemo(() => {
    if (!topicData) return [];
    const [ids, names, descriptions] = topicData as [
      bigint[],
      string[],
      string[]
    ];

    return ids.map((id, index) => ({
      id: id,
      name: names[index],
      description: descriptions[index],
    }));
  }, [topicData]);

  const handleIssueClaim = async () => {
    if (!isAuthorizedIssuer) {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to issue claims",
        variant: "destructive",
      });
      return;
    }

    if (!newClaim.userAddress || !newClaim.topicId) {
      toast({
        title: "Missing Information",
        description: "Please provide both user address and claim topic",
        variant: "destructive",
      });
      return;
    }

    setIsIssuing(true);

    try {
      const topicId = parseInt(newClaim.topicId);
      const topic = topics.find((t) => t.id === BigInt(topicId));
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expiryDays = parseInt(newClaim.expiryDays);
      const validTo = currentTimestamp + expiryDays * 24 * 60 * 60;

      const claim: IssuedClaim = {
        userAddress: newClaim.userAddress,
        topicId,
        topicName: topic?.name || `Topic ${topicId}`,
        timestamp: new Date().toISOString(),
      };

      const hash = generateClaimMessage(
        Number(topic.id),
        claim.userAddress,
        currentTimestamp
      );
      const signed = await signMessageAsync({ message: hash });
      const dataBytes = stringToHex(newClaim.data || "");

      const result = await writeContract({
        address: IdentityContractAddress,
        abi: IdentityABI,
        functionName: "addClaim",
        args: [topicId, newClaim.userAddress, signed, dataBytes, validTo],
      });

      if (result) {
        console.log("result", result);
        toast({
          title: "Claim Issued Successfully",
          description: `${claim.topicName} claim issued to ${claim.userAddress.slice(0, 6)}...${claim.userAddress.slice(-4)}`,
          variant: "default",
        });
      }
      setNewClaim({ userAddress: "", topicId: "", data: "", expiryDays: "365" });
    } catch (error) {
      console.log("error", error);
      toast({
        title: "Failed to Issue Claim",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  if (!isAuthorizedIssuer) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Unauthorized Access</h3>
          <p className="text-muted-foreground mb-4">
            You are not registered as a trusted issuer.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 max-w-md mx-auto">
            <Info className="h-4 w-4 text-destructive mt-0.5" />
            <p className="text-sm text-muted-foreground text-left">
              Contact an administrator to get registered as a trusted issuer for specific claim topics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Issue Identity Claim
          </CardTitle>
          <CardDescription>
            Issue claims to user identities for compliance verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              As a trusted issuer, you can issue cryptographic attestations that verify specific
              attributes about user identities for regulatory compliance.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="user-address">User Identity Address</Label>
              <Input
                id="user-address"
                placeholder="0x... (Identity contract address)"
                value={newClaim.userAddress}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, userAddress: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="claim-topic">Claim Topic</Label>
              <Select
                value={newClaim.topicId}
                onValueChange={(value) =>
                  setNewClaim({ ...newClaim, topicId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a claim topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name} (ID: {Number(topic.id)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="claim-data">Claim Data</Label>
              <Input
                id="claim-data"
                placeholder="Enter verification data (e.g. KYC hash, document reference)"
                value={newClaim.data}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, data: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="expiry-days">Validity Period (Days)</Label>
              <Select
                value={newClaim.expiryDays}
                onValueChange={(value) =>
                  setNewClaim({ ...newClaim, expiryDays: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select validity period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleIssueClaim}
              className="w-full"
              variant="default"
              disabled={isIssuing}
            >
              {isIssuing ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Issue Claim
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                My Issued Claims
              </CardTitle>
              <CardDescription>
                Claims you have issued to user identities
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const result = await refetchAllClaims();
                if (result.status === "success") {
                  toast({ title: "Claims refreshed successfully" });
                } else {
                  toast({
                    title: "Failed to refresh claims",
                    variant: "destructive",
                  });
                }
              }}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>Loading claims from blockchain...</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allClaims.map((claim, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-success/70 text-success-foreground"
                        >
                          Topic ID: {claim.topic}
                        </Badge>

                        {claim.isValid !== undefined && (
                          <Badge
                            variant={claim.isValid ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {claim.isValid ? "Valid" : "Expired"}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(claim.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        User:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatAddress(claim.userAddress || claim.issuer)}
                      </Badge>
                    </div>

                    {claim.validTo && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Valid Until:
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(claim.validTo * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {claim.data && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Data:
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-48">
                          {claim.data}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {allClaims.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No claims issued yet</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}