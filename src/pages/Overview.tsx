import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Users, CheckCircle, Zap } from "lucide-react";

export default function Overview() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-glow to-primary/80 text-primary-foreground py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            ERC-3643 Playground
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-4xl mx-auto leading-relaxed">
            Experience compliant digital asset management with identity verification and regulatory compliance built into every transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="px-10 py-4 text-lg font-semibold">
              Start Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-10 py-4 text-lg font-semibold border-white/30 hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Compliance</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ERC-3643 ensures only verified entities can participate in your token ecosystem through on-chain identity verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <Card className="text-center p-8 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Identity Registry</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Link verified identities to wallet addresses with cryptographic claims for KYC, AML, and regulatory compliance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Automated Compliance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every token transfer is automatically verified against compliance rules, preventing unauthorized transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Enterprise Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built for institutional use with role-based access, trusted issuers, and regulatory compliance frameworks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Simple Process */}
      <div className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple 3-Step Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Create Identity</h3>
              <p className="text-muted-foreground leading-relaxed">
                Register your on-chain identity and connect it to your wallet address for verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Get Verified</h3>
              <p className="text-muted-foreground leading-relaxed">
                Obtain compliance claims from trusted issuers for KYC, AML, and other requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Transfer Tokens</h3>
              <p className="text-muted-foreground leading-relaxed">
                Transfer compliant tokens with automatic verification of recipient eligibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore?</h2>
          <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
            Connect your wallet and experience the future of compliant digital assets.
          </p>
          <Button size="lg" variant="secondary" className="px-12 py-4 text-lg font-semibold">
            Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
