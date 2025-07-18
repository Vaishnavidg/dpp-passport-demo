import { RequestClaimModal } from "@/components/claim-request/RequestClaimModal";
import { MyClaimRequestsList } from "@/components/claim-request/MyClaimRequestsList";

// Mock trusted issuers for the modal
const mockTrustedIssuers = [
  "0x742d35Cc6634C0532925a3b8D0829677fa3fD5D",
  "0x8ba1f109551bD432803012645Hac136c59dd5043e",
  "0x123456789012345678901234567890123456789",
];

export function ClaimRequestsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claim Requests</h2>
          <p className="text-muted-foreground">
            Request identity verification claims from trusted issuers
          </p>
        </div>
        <RequestClaimModal trustedIssuers={mockTrustedIssuers} />
      </div>
      
      <MyClaimRequestsList />
    </div>
  );
}