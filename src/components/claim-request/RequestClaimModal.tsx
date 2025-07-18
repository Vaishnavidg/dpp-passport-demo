import { useState } from "react";
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

interface ClaimType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const claimTypes: ClaimType[] = [
  {
    id: "kyc",
    name: "KYC Verification",
    icon: User,
    description: "Know Your Customer verification",
  },
  {
    id: "aml",
    name: "AML Compliance",
    icon: Shield,
    description: "Anti-Money Laundering compliance check",
  },
  {
    id: "proof-of-residency",
    name: "Proof of Residency",
    icon: MapPin,
    description: "Verification of residential address",
  },
  {
    id: "business-license",
    name: "Business License",
    icon: Building,
    description: "Business registration verification",
  },
  {
    id: "identity-document",
    name: "Identity Document",
    icon: FileCheck,
    description: "Government-issued ID verification",
  },
];

interface RequestClaimModalProps {
  trustedIssuers?: string[];
}

export function RequestClaimModal({ trustedIssuers = [] }: RequestClaimModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState("");
  const [issuerAddress, setIssuerAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      // Simulate API call to store claim request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Claim Request Submitted",
        description: "Your request has been sent to the issuer for review.",
      });
      
      // Reset form
      setSelectedClaimType("");
      setIssuerAddress("");
      setMessage("");
      setIsOpen(false);
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

  const selectedClaim = claimTypes.find(claim => claim.id === selectedClaimType);

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
            Submit a request to a trusted issuer for identity verification claims.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Claim Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="claim-type">Claim Type</Label>
            <Select value={selectedClaimType} onValueChange={setSelectedClaimType}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of claim you need" />
              </SelectTrigger>
              <SelectContent>
                {claimTypes.map((claim) => (
                  <SelectItem key={claim.id} value={claim.id}>
                    <div className="flex items-center gap-2">
                      <claim.icon className="h-4 w-4" />
                      <span>{claim.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClaim && (
              <p className="text-sm text-muted-foreground">
                {selectedClaim.description}
              </p>
            )}
          </div>

          {/* Issuer Address */}
          <div className="space-y-2">
            <Label htmlFor="issuer-address">Trusted Issuer</Label>
            {trustedIssuers.length > 0 ? (
              <Select value={issuerAddress} onValueChange={setIssuerAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trusted issuer" />
                </SelectTrigger>
                <SelectContent>
                  {trustedIssuers.map((issuer, index) => (
                    <SelectItem key={issuer} value={issuer}>
                      <div className="font-mono text-sm">
                        {issuer.slice(0, 6)}...{issuer.slice(-4)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="issuer-address"
                placeholder="0x... (Trusted issuer wallet address)"
                value={issuerAddress}
                onChange={(e) => setIssuerAddress(e.target.value)}
                className="font-mono"
              />
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Information (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Provide any additional context or information for the issuer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
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