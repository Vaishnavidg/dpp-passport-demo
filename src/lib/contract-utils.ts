/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeContract, readContract } from "@wagmi/core";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface ContractConfig {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args?: any[];
}

export interface TransactionResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Utility function to format addresses consistently
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return "";
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Utility function to copy text to clipboard
export async function copyToClipboard(
  text: string,
  toast: any
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text has been copied to clipboard",
      variant: "default",
    });
    return true;
  } catch (error) {
    toast({
      title: "Copy Failed",
      description: "Failed to copy text to clipboard",
      variant: "destructive",
    });
    return false;
  }
}

// Generic contract write function with error handling
export async function executeContractWrite(
  config: ContractConfig,
  toast: any,
  successMessage?: string,
  errorMessage?: string
): Promise<TransactionResult> {
  try {
    const result = await writeContract(config);

    if (result) {
      toast({
        title: "Success",
        description: successMessage || "Transaction completed successfully",
        variant: "default",
      });
      return { success: true, data: result };
    } else {
      toast({
        title: "Error",
        description: "Transaction not ready. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: "Transaction not ready" };
    }
  } catch (error: any) {
    const errorMsg =
      error?.shortMessage ||
      error?.message ||
      errorMessage ||
      "Transaction failed";
    console.error("Contract write error:", error);

    toast({
      title: "Transaction Failed",
      description: errorMsg,
      variant: "destructive",
    });

    return { success: false, error: errorMsg };
  }
}

// Generic contract read function with error handling
export async function executeContractRead(
  config: ContractConfig
): Promise<TransactionResult> {
  try {
    const result = await readContract({
      ...config,
      args: config.args || [],
    });
    return { success: true, data: result };
  } catch (error: any) {
    const errorMsg =
      error?.shortMessage || error?.message || "Contract read failed";
    console.error("Contract read error:", error);
    return { success: false, error: errorMsg };
  }
}

// Validation utilities
export function validateRequiredFields(
  fields: Record<string, any>,
  toast: any
): boolean {
  const missingFields = Object.entries(fields)
    .filter(
      ([_, value]) =>
        !value || (typeof value === "string" && value.trim() === "")
    )
    .map(([key, _]) => key);

  if (missingFields.length > 0) {
    toast({
      title: "Missing Information",
      description: `Please provide: ${missingFields.join(", ")}`,
      variant: "destructive",
    });
    return false;
  }
  return true;
}

// Common loading state management
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = async (asyncFunction: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      return result;
    } catch (err: any) {
      const errorMsg = err?.message || "Operation failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeWithLoading,
    setError,
  };
}
