import { RequestClaimModal } from "@/components/claim-request/RequestClaimModal";
import { MyClaimRequestsList } from "@/components/claim-request/MyClaimRequestsList";
import { useContractRead } from "wagmi";
import TrustedIssuersABI from "../../../contracts-abi-files/TrustedIssuersABI.json";
import { useEffect, useMemo, useState } from "react";
import { readContract } from "@wagmi/core";
import { CONTRACT_ADDRESSES } from "@/lib/config";

const TrustedIssuersRegistryAddress =
  CONTRACT_ADDRESSES.TRUST_ISSUER_REGISTRY_ADDRESS as `0x${string}`;

interface TrustedIssuer {
  address: string;
  name: string;
  topics: string[];
}

export function ClaimRequestsTab() {
  const { data: issuers } = useContractRead({
    address: TrustedIssuersRegistryAddress,
    abi: TrustedIssuersABI,
    functionName: "getAllIssuersDetails",
    watch: true,
  });
  const [trustedIssuers, setTrustedIssuers] = useState<TrustedIssuer[]>([]);

  useEffect(() => {
    const fetchTrustedIssuers = async () => {
      if (!issuers) return;

      const [addresses, flatTopics, names] = issuers as [
        string[],
        bigint[],
        string[]
      ];

      const results = await Promise.all(
        addresses.map(async (address, index) => {
          try {
            const topicsData = await readContract({
              address: TrustedIssuersRegistryAddress as `0x${string}`,
              abi: TrustedIssuersABI.filter((item) => item.type === "function"),
              functionName: "getTopicsForIssuer",
              args: [address],
            });

            return {
              address: address.toString(),
              name: names[index],
              topics: (topicsData as bigint[]).map((t) => t.toString()),
            };
          } catch (error) {
            console.error(
              `Failed to fetch topics for issuer ${address}`,
              error
            );
            return {
              address: address.toString(),
              name: names[index],
              topics: [],
            };
          }
        })
      );

      setTrustedIssuers(results);
    };

    fetchTrustedIssuers();
  }, [issuers]);

  console.log(trustedIssuers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claim Requests</h2>
          <p className="text-muted-foreground">
            Request identity verification claims from trusted issuers
          </p>
        </div>
        <RequestClaimModal trustedIssuers={trustedIssuers} />
      </div>

      <MyClaimRequestsList />
    </div>
  );
}
