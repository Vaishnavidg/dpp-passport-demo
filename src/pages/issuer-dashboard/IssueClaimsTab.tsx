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
import {
  Shield,
  Send,
  Info,
  CheckCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { writeContract, readContract } from "@wagmi/core";
import {
  useSignMessage,
  useAccount,
  usePublicClient,
  useContractEvent,
  useContractRead,
} from "wagmi";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import TrustedIssuersABI from "../../../contracts-abi-files/TrustedIssuersABI.json";
import { encodePacked, hexToString, keccak256, stringToHex } from "viem";

/* ------------------------------------------------------------------
 * CONSTANTS
 * ----------------------------------------------------------------*/
const IdentityAddress = "0x66B7642b399A6c72b72129E8F1Af35DbcBf36b7d";
const ClaimTopicAddress = "0x7697208833D220C5657B3B52D1f448bEdE084948";
const TrustedIssuersRegistryAddress =
  "0xDaAEeCe678eb75fA3898606dD69262c255860eAF";

/* ------------------------------------------------------------------
 * HELPERS
 * ----------------------------------------------------------------*/
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
  isValid?: boolean;
}

/* ------------------------------------------------------------------
 * COMPONENT
 * ----------------------------------------------------------------*/
export function IssueClaimsTab() {
  /* ------------------------------------------------------------------
   * REACT STATE
   * ----------------------------------------------------------------*/
  const [newClaim, setNewClaim] = useState({
    requestId: "",
    userAddress: "",
    topicId: "",
    data: "",
    expiryDays: "365",
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [isAuthorizedIssuer, setIsAuthorizedIssuer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { address } = useAccount();

  /** Raw `ClaimAdded` logs fetched from the chain */
  const [rawClaimLogs, setRawClaimLogs] = useState<any[]>([]);

  /** Map of topicId -> validity (true / false) */
  const [claimValidity, setClaimValidity] = useState<Record<number, boolean>>(
    {}
  );

  /** Loading state for claim log fetch */
  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------------
   * HOOKS
   * ----------------------------------------------------------------*/
  const { toast } = useToast();
  const { signMessageAsync } = useSignMessage();
  const { address: currentUser } = useAccount();
  const publicClient = usePublicClient();

  /* ------------------------------------------------------------------
   * AUTHORIZATION CHECK
   * ----------------------------------------------------------------*/
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

  /* ------------------------------------------------------------------
   * CLAIM TOPICS METADATA
   * ----------------------------------------------------------------*/
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
      id,
      name: names[index],
      description: descriptions[index],
    }));
  }, [topicData]);

  /* ------------------------------------------------------------------
   * FETCH CLAIM LOGS + VALIDITY
   * ----------------------------------------------------------------*/

  /* Subscribe to live ClaimAdded events so UI updates immediately */
  const rawClaim = useContractRead({
    address: IdentityAddress,
    abi: IdentityABI,
    functionName: "getRequestsForIssuer",
    args: [address],
    watch: true,
  });
  console.log(rawClaim.data);

  /* ------------------------------------------------------------------
   * allClaims – memoized transformation of raw logs + validity
   * ----------------------------------------------------------------*/
  const allClaims = useMemo(() => {
    if (!rawClaim) return [];
    const [ids, userAddress, topicIds, statuses] = rawClaim.data as [
      bigint[],
      string[],
      bigint[],
      boolean[]
    ];
    return ids.map((id, index) => {
      const topicId = topicIds[index].toString();
      console.log("topic id", topicId);
      console.log("topics", topics);
      const topic = topics.find((t) => t.id.toString() === topicId);
      console.log("topic", topic);

      const claimType = topic ? topic.name : "Unknown";
      const statusValue = statuses[index];
      const status = statusValue === false ? "pending" : "approved";

      return {
        id: id.toString(),
        requesterAddress: userAddress[index],
        claimType,
        status,
      };
    });
  }, [rawClaim, topics]);

  const approvedClaims = allClaims.filter(
    (claim) => claim.status === "approved"
  );

  /* ------------------------------------------------------------------
   * ISSUE CLAIM HANDLER
   * ----------------------------------------------------------------*/
  const handleIssueClaim = async () => {
    setErrorMessage("");
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

      const hash = generateClaimMessage(
        topicId,
        newClaim.userAddress,
        currentTimestamp
      );
      const signed = await signMessageAsync({ message: hash });
      const dataBytes = stringToHex(newClaim.data || "");

      await writeContract({
        address: IdentityAddress,
        abi: IdentityABI,
        functionName: "addClaim",
        args: [
          topicId,
          newClaim.userAddress,
          signed,
          dataBytes,
          validTo,
          newClaim.requestId,
        ],
      });

      toast({
        title: "Claim Issued Successfully",
        description: `${
          topic?.name || `Topic ${topicId}`
        } claim issued to ${newClaim.userAddress.slice(
          0,
          6
        )}...${newClaim.userAddress.slice(-4)}`,
      });
      setNewClaim({
        requestId: "",
        userAddress: "",
        topicId: "",
        data: "",
        expiryDays: "365",
      });
    } catch (error: any) {
      const errMsg =
        error?.shortMessage || error?.message || "Failed to add claim.";
      setErrorMessage(errMsg);
      toast({
        title: "Failed to Issue Claim",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  /* ------------------------------------------------------------------
   * FORMATTERS
   * ----------------------------------------------------------------*/
  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatTimestamp = (ts: string) =>
    `${new Date(ts).toLocaleDateString()} ${new Date(ts).toLocaleTimeString()}`;

  /* ------------------------------------------------------------------
   * RENDER – UNAUTHORIZED VIEW
   * ----------------------------------------------------------------*/
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
              Contact an administrator to get registered as a trusted issuer for
              specific claim topics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ------------------------------------------------------------------
   * RENDER – MAIN VIEW
   * ----------------------------------------------------------------*/
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ---------------- Form Card ---------------- */}
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
              As a trusted issuer, you can issue cryptographic attestations that
              verify specific attributes about user identities for regulatory
              compliance.
            </p>
          </div>

          <div className="space-y-3">
            {/*  Request Id */}
            <div>
              <Label htmlFor="user-address">Request Id</Label>
              <Input
                id="user-address"
                placeholder="1, 2.."
                value={newClaim.requestId}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, requestId: e.target.value })
                }
              />
            </div>
            {/* User Address */}
            <div>
              <Label htmlFor="user-address">User Identity Address</Label>
              <Input
                id="user-address"
                placeholder="0x..."
                value={newClaim.userAddress}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, userAddress: e.target.value })
                }
              />
            </div>

            {/* Claim Topic */}
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
                    <SelectItem
                      key={topic.id.toString()}
                      value={topic.id.toString()}
                    >
                      {topic.name} (ID: {Number(topic.id)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Claim Data */}
            <div>
              <Label htmlFor="claim-data">Claim Data</Label>
              <Input
                id="claim-data"
                placeholder="Enter verification data"
                value={newClaim.data}
                onChange={(e) =>
                  setNewClaim({ ...newClaim, data: e.target.value })
                }
              />
            </div>

            {/* Expiry */}
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
              disabled={isIssuing}
            >
              {isIssuing ? (
                "Processing..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Issue Claim
                </>
              )}
            </Button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* ---------------- Claims List Card ---------------- */}
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
              onClick={() => approvedClaims}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>Loading claims from blockchain...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {approvedClaims.map((claim) => (
                <div
                  key={`${claim.id}`}
                  className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-success/70 text-success-foreground"
                        >
                          Topic ID: {claim.claimType}
                        </Badge>
                        {/* {claim.claimType !== undefined && (
                          <Badge
                            variant={claim.status ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {claim. ? "Valid" : "Expired"}
                          </Badge>
                        )} */}
                      </div>
                      {/* <span className="text-xs text-muted-foreground">
                        {formatTimestamp(claim.timestamp)}
                      </span> */}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        User:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatAddress(claim.requesterAddress)}
                      </Badge>
                    </div>

                    {/* Valid To */}
                    {/* {claim.validTo && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Valid Until:
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(claim.validTo * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )} */}
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
