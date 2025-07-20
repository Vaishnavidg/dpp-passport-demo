import { useEffect, useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { useToast } from "@/hooks/use-toast";
import { readContract } from "@wagmi/core";
import TrustedIssuersABI from "../../contracts-abi-files/TrustedIssuersABI.json";
import { ADMIN_ADDRESS, CONTRACT_ADDRESSES } from "@/lib/config";

const Admin = ADMIN_ADDRESS as `0x${string}`;
const TrustedIssuersRegistryAddress =
  CONTRACT_ADDRESSES.TRUST_ISSUER_REGISTRY_ADDRESS;

export function useWalletConnection() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTrustedIssuer, setIsTrustedIssuer] = useState(false);

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(walletAddress === Admin);
  }, [walletAddress]);

  // Check if user is a trusted issuer
  useEffect(() => {
    const checkIssuerStatus = async () => {
      if (!walletAddress) {
        setIsTrustedIssuer(false);
        return;
      }

      try {
        const result = await readContract({
          address: TrustedIssuersRegistryAddress as `0x${string}`,
          abi: TrustedIssuersABI,
          functionName: "isTrustedIssuer",
          args: [walletAddress],
        });
        setIsTrustedIssuer(result as boolean);
      } catch (error) {
        console.error("Error checking issuer status:", error);
        setIsTrustedIssuer(false);
      }
    };

    checkIssuerStatus();
  }, [walletAddress]);

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to wallet",
      });
    }
  }, [isConnected, address, toast]);

  const connectWallet = async () => {
    try {
      if (isConnected) {
        await disconnect();
        toast({
          title: "Wallet Disconnected",
          description: "Successfully disconnected from wallet",
        });
      } else {
        await open();
      }
    } catch (error) {
      console.error("Error managing wallet connection:", error);
      toast({
        title: "Operation Failed",
        description: isConnected
          ? "Failed to disconnect wallet. Please try again."
          : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    walletAddress,
    isConnected,
    isAdmin,
    isTrustedIssuer,
    balance,
    connectWallet,
  };
}
