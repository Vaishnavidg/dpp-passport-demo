/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAccount,
  useContractRead,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  User,
  CheckCircle,
  Info,
  ExternalLink,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EDUCATIONAL_MESSAGES } from "@/lib/config";
import { writeContract, readContract } from "@wagmi/core";
import TokenFactoryABI from "../../../contracts-abi-files/TokenFactoryABI.json";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import { IdentityBytecode } from "../../../contracts-abi-files/Identity_Bytecode.js";
import IdentityRegistryABI from "../../../contracts-abi-files/IdentityRegistryABI.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hardhat } from "viem/chains";
import { Label } from "@/components/ui/label.js";

const TokenFactoryAddress = "0x014c819c9b01510C14d597ca19CDA699FE8C0BB1";
const IdentityRegistryAddress = "0x9e1EFE110aC3615ad3B669CC6a424e24e41bFd05";

export function CreateIdentityTab() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const { address } = useAccount();
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [countryCode, setCountryCode] = useState(0);
  const { chain } = useNetwork();

  const identityFromRegistry = useContractRead({
    address: IdentityRegistryAddress,
    abi: IdentityRegistryABI,
    functionName: "identities",
    args: [address],
    watch: true,
  });

  // Check if the identity address is valid (not zero address)
  const isValidIdentityAddress =
    identityFromRegistry.data &&
    identityFromRegistry.data !== "0x0000000000000000000000000000000000000000";

  const [identityAddress, setIdentityAddress] = useState<string | null>(
    isValidIdentityAddress ? (identityFromRegistry.data as string) : null
  );

  const handleDeployIdentity = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);

    try {
      // Deploy Identity contract using TokenFactory
      const hash = await walletClient.deployContract({
        abi: IdentityABI,
        bytecode: IdentityBytecode,
        account: address,
        chain: chain,
      });

      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        const contractAddress = receipt.contractAddress;
        console.log("hash", hash);
        setIdentityAddress(contractAddress);

        toast({
          title: "Identity Created Successfully",
          description: `Identity contract deployed at ${contractAddress.slice(
            0,
            6
          )}...${contractAddress.slice(-4)}`,
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Deployment error:", error);
      const errorMessage =
        error.message || "Failed to deploy identity contract";
      setDeploymentError(errorMessage);

      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleConnectIdentity = async () => {
    if (!identityAddress) return;

    try {
      // Verify the identity contract exists and is accessible
      const result = await writeContract({
        address: IdentityRegistryAddress,
        abi: IdentityRegistryABI,
        functionName: "registerIdentity",
        args: [address, identityAddress, countryCode],
        enabled: !!address && identityAddress && countryCode,
      });
      if (result) {
        console.log("result", result);
        setIsConnected(true);
        toast({
          title: "Identity Connected",
          description: "Successfully connected to your identity contract",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description:
          "Failed to connect to identity. Please verify the contract address.",
        variant: "destructive",
      });
    }
  };

  const registryStatus = useContractRead({
    address: IdentityRegistryAddress,
    abi: IdentityRegistryABI,
    functionName: "isVerified",
    args: [address],
    watch: true,
  });
  console.log("registryStatus", registryStatus.data);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
  };

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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Create Identity Contract
          </CardTitle>
          <CardDescription>
            Deploy your on-chain identity for ERC-3643 compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {EDUCATIONAL_MESSAGES.IDENTITY_REQUIRED}
            </p>
          </div>

          {deploymentError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">
                <strong>Deployment Error:</strong> {deploymentError}
              </p>
            </div>
          )}

          {!identityAddress ? (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <h4 className="font-medium mb-2">
                  What is an Identity Contract?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stores your claims and verification status</li>
                  <li>• Required for all ERC-3643 token interactions</li>
                  <li>• Links your wallet to compliance data</li>
                  <li>• Enables regulated token transfers</li>
                </ul>
              </div>

              <Button
                onClick={handleDeployIdentity}
                className="w-full"
                variant="default"
                disabled={isDeploying || !address}
              >
                {isDeploying ? "Deploying..." : "Deploy Identity Contract"}
              </Button>

              {!address && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to deploy an identity
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-success bg-success/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">
                    Identity Deployed
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Contract Address:</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {formatAddress(identityAddress)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(identityAddress)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {!isValidIdentityAddress && (
                <>
                  <Label htmlFor="country">Country of Residence</Label>
                  <Select
                    onValueChange={(val) => setCountryCode(parseInt(val))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="356">🇮🇳 India (356)</SelectItem>
                      <SelectItem value="840">🇺🇸 USA (840)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleConnectIdentity}
                    className="w-full"
                    variant="default"
                  >
                    Connect to Identity
                  </Button>
                </>
              )}

              {isValidIdentityAddress && (
                <div className="p-4 rounded-lg border border-success bg-success/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">
                      Connected to Identity
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Identity Status</CardTitle>
          <CardDescription>
            Current state of your ERC-3643 identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Wallet Connected</span>
              <Badge variant={address ? "default" : "secondary"}>
                {address ? "Yes" : "No"}
              </Badge>
            </div>

            {address && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
                <span className="text-sm">Wallet Address</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {formatAddress(address)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(address)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Identity Contract</span>
              <Badge variant={identityAddress ? "default" : "secondary"}>
                {identityAddress ? "Deployed" : "Not Deployed"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Identity Connected</span>
              <Badge variant={isValidIdentityAddress ? "default" : "secondary"}>
                {isValidIdentityAddress ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30">
              <span className="text-sm">Registry Status</span>
              <Badge variant={registryStatus.data ? "default" : "secondary"}>
                {registryStatus.data ? "Registered" : "Not Registered"}
              </Badge>
            </div>
          </div>

          {identityAddress && (
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full gap-2" asChild>
                <a
                  href={`https://explorer-watr-testnet.cogitus.io/address/${identityAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
