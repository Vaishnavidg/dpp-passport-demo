import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Shield, FileCheck, MapPin, Building, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContractRead } from "wagmi";
import ClaimTopicsABI from "../../../contracts-abi-files/ClaimTopicsABI.json";
import IdentityABI from "../../../contracts-abi-files/IdentityABI.json";
import { writeContract } from "@wagmi/core";
import { CONTRACT_ADDRESSES } from "@/lib/config";

const ClaimTopicAddress =
  CONTRACT_ADDRESSES.CLAIM_TOPIC_REGISTRY_ADDRESS as `0x${string}`;
const IdentityAddress = CONTRACT_ADDRESSES.IDENTITY_ADDRESS as `0x${string}`;

interface ClaimType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface TrustedIssuer {
  address: string;
  name: string;
  topics: string[];
}

interface RequestClaimModalProps {
  trustedIssuers?: TrustedIssuer[];
}

export function RequestClaimModal({
  trustedIssuers = [],
}: RequestClaimModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data } = useContractRead({
    address: ClaimTopicAddress,
    abi: ClaimTopicsABI,
    functionName: "getClaimTopicsWithNamesAndDescription",
    watch: true,
  });
  const topics = useMemo(() => {
    if (!data) return [];
    const [ids, names, descriptions] = data as [bigint[], string[], string[]];

    return ids.map((id, index) => ({
      id: id.toString(),
      name: names[index],
      description: descriptions[index],
    }));
  }, [data]);
  console.log("topics", topics);

  const handleSubmit = async () => {
    if (!selectedClaimType || !issuerAddress) {
      toast({
        title: "Missing Information",
        description: "Please select a claim type and issuer address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await writeContract({
        address: IdentityAddress,
        abi: IdentityABI,
        functionName: "submitClaimRequest",
        args: [issuerAddress, selectedClaimType], // Empty topics for now, can be updated later
      });
      if (result) {
        console.log("result", result);
        toast({
          title: "Claim Request Submitted",
          description: "Your request has been sent to the issuer for review.",
        });

        // Reset form
        setSelectedClaimType("");
        setIssuerAddress("");
        setMessage("");
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit claim request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredIssuers = useMemo(() => {
    if (!selectedClaimType) return trustedIssuers;
    return trustedIssuers.filter((issuer) =>
      issuer.topics.includes(selectedClaimType)
    );
  }, [selectedClaimType, trustedIssuers]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Request Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Request New Claim
          </DialogTitle>
          <DialogDescription>
            Submit a request to a trusted issuer for identity verification
            claims.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Claim Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="claim-type">Claim Type</Label>
            <Select
              value={selectedClaimType}
              onValueChange={setSelectedClaimType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the type of claim you need" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    <div className="flex items-center gap-2">
                      {/* <claim.topics className="h-4 w-4" /> */}
                      <span>{topic.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* {selectedClaim && (
              <p className="text-sm text-muted-foreground">
                {selectedClaim.description}
              </p>
            )} */}
          </div>

          {/* Issuer Address */}
          <div className="space-y-2">
            <Label htmlFor="issuer-address">Trusted Issuer</Label>
            {filteredIssuers.length > 0 ? (
              <Select value={issuerAddress} onValueChange={setIssuerAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trusted issuer" />
                </SelectTrigger>
                <SelectContent>
                  {filteredIssuers.map((issuer) => (
                    <SelectItem key={issuer.address} value={issuer.address}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {issuer.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {issuer.address.slice(0, 6)}...
                          {issuer.address.slice(-4)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="issuer-address"
                placeholder="No issuer found for this topic. Enter manually..."
                value={issuerAddress}
                onChange={(e) => setIssuerAddress(e.target.value)}
                className="font-mono"
              />
            )}
          </div>

          {/* Optional Message */}
          {/* <div className="space-y-2">
            <Label htmlFor="message">Additional Information (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Provide any additional context or information for the issuer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div> */}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
