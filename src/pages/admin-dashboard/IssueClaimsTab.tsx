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
import { Shield, Send, Info, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { writeContract, readContract } from "@wagmi/core";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import {
  encodePacked,
  hexToString,
  keccak256,
  stringToHex,
  toBytes,
} from "viem";
import { useContractRead, useSignMessage } from "wagmi";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";

const IdentityContractAddress = "0x2B30a59589df3C3679e1374ec4ae13d938f5621c";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";

const generateClaimMessage = (
  topic: number,
  userAddress: string,
  timestamp: number
): `0x${string}` => {
  const packed = encodePacked(
    ["uint256", "address", "uint256"],
    [BigInt(topic), userAddress as `0x${string}`, BigInt(timestamp)]
  );
  const hashedMessage = keccak256(packed); // bytes32 hash
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
  // const [issuedClaims, setIssuedClaims] = useState<IssuedClaim[]>([]);
  const [newClaim, setNewClaim] = useState({
    userAddress: "",
    topicId: "",
    data: "",
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [allClaims, setAllClaims] = useState<any[]>([]);

  // const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signMessageAsync } = useSignMessage();

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

  // const [claimsWithValidity, setClaimsWithValidity] = useState<any[]>([]);

  // const allClaimsRaw = useMemo(() => {
  //   if (!data) return [];

  //   const [topics, issuers, signatures, datas, validsTo] = data as [
  //     bigint[],
  //     string[],
  //     string[],
  //     string[],
  //     bigint[]
  //   ];

  //   return topics.map((topic, index) => ({
  //     topic,
  //     issuer: issuers[index],
  //     signature: signatures[index],
  //     data: datas[index],
  //     validTo: Number(validsTo[index]),
  //   }));
  // }, [data]);

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
            ).toISOString(), // assuming 1 year validity
            isValid,
          };
        })
      );

      setAllClaims(enrichedClaims);
    };

    fetchClaimsWithValidity();
  }, [rawClaims]);

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
      // Set claim to be valid for 1 year (you can adjust this)
      const validTo = currentTimestamp + 365 * 24 * 60 * 60;

      const claim: IssuedClaim = {
        userAddress: newClaim.userAddress,
        topicId,
        topicName: topic?.name || `Topic ${topicId}`,
        timestamp: new Date().toISOString(), // Keep this for display purposes
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
        enabled: claim && topic && signed && validTo && newClaim,
      });
      if (result) {
        console.log("result", result);
        toast({
          title: "Claim Issued Successfully",
          description: `${
            claim.topicName
          } claim issued to ${claim.userAddress.slice(
            0,
            6
          )}...${claim.userAddress.slice(-4)}`,
          variant: "default",
        });
      }
      setNewClaim({ userAddress: "", topicId: "", data: "" });
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
              Claims are cryptographic attestations that verify specific
              attributes about an identity. Only users with valid claims can
              interact with regulated tokens.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="user-address">User Address</Label>
              <Input
                id="user-address"
                placeholder="0x..."
                value={newClaim.userAddress}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, userAddress: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="claim-data">Claim Data</Label>
              <Input
                id="claim-data"
                placeholder="Enter claim data (e.g. Name, ID, etc)"
                value={newClaim.data}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, data: e.target.value })
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
                Recently Issued Claims
              </CardTitle>
              <CardDescription>
                Claims issued to user identities
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
                        Issuer:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {claim.issuer || claim.userAddress}
                        {/* {formatAddress(claim.issuer || claim.userAddress)} */}
                      </Badge>
                    </div>

                    {claim.validTo && (
                      <div className="flex items-center gap-2">
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
                  <p>No claims found on blockchain</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
