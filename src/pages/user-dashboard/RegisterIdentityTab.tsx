import { useState } from "react";
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
import { Shield, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES, EDUCATIONAL_MESSAGES } from "@/lib/config";
import { useAccount } from "wagmi";

export function RegisterIdentityTab() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    country: "",
    investorType: "",
    identityAddress: "",
  });
  const { address } = useAccount();
  const { toast } = useToast();

  const handleRegisterIdentity = async () => {
    if (!registrationForm.country || !registrationForm.investorType) {
      toast({
        title: "Missing Information",
        description: "Please select both country and investor type",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      // Simulate identity registration
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setIsRegistered(true);

      toast({
        title: "Identity Registered Successfully",
        description:
          "Your identity has been registered in the identity registry",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to register identity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const selectedCountry = COUNTRIES.find(
    (c) => c.code === registrationForm.country
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Register Identity
          </CardTitle>
          <CardDescription>
            Register your identity in the compliance registry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Registration links your wallet to your identity and enables
              compliance verification. This is required before receiving any
              regulated tokens.
            </p>
          </div>

          {!isRegistered ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="identity-address">
                  Identity Contract Address
                </Label>
                <Input
                  id="identity-address"
                  placeholder="0x... (from previous step)"
                  value={registrationForm.identityAddress}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      identityAddress: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="country">Country of Residence</Label>
                <Select
                  value={registrationForm.country}
                  onValueChange={(value) =>
                    setRegistrationForm({ ...registrationForm, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="investor-type">Investor Type</Label>
                <Select
                  value={registrationForm.investorType}
                  onValueChange={(value) =>
                    setRegistrationForm({
                      ...registrationForm,
                      investorType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Investor</SelectItem>
                    <SelectItem value="professional">
                      Professional Investor
                    </SelectItem>
                    <SelectItem value="institutional">
                      Institutional Investor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleRegisterIdentity}
                className="w-full"
                variant="default"
                disabled={isRegistering || !address}
              >
                {isRegistering ? "Registering..." : "Register Identity"}
              </Button>

              {!address && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to register
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-success bg-success/10">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">
                    Registration Complete
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <Badge variant="outline">{selectedCountry?.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline">
                      {registrationForm.investorType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-success/20 text-success-foreground">
                      Registered
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  You still need valid claims from trusted issuers to interact
                  with regulated tokens.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Registration Requirements</CardTitle>
          <CardDescription>
            What you need to complete registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <h4 className="font-medium mb-2">Required Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Valid identity contract address</li>
                <li>• Country of residence verification</li>
                <li>• Investor classification</li>
                <li>• Wallet connection</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <h4 className="font-medium mb-2">After Registration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Identity linked to wallet address</li>
                <li>• Eligible for claim issuance</li>
                <li>• Can request KYC verification</li>
                <li>• Prepared for token interactions</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-primary bg-primary/10">
              <h4 className="font-medium mb-2 text-primary">Next Steps</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Wait for admin to issue claims</li>
                <li>• Verify your claims in "My Claims" tab</li>
                <li>• Test token transfers once verified</li>
                <li>• Monitor compliance status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
