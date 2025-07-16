import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, CheckCircle } from "lucide-react";
import React from "react";

export default function Overview() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted Framework for Regulated Digital Assets
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-3xl mx-auto">
            Powered by ERC-3643 standard, enabling compliant token transfers with identity verification and regulatory compliance built-in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/30 hover:bg-white/10">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* What is ERC-3643 Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What is ERC-3643?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              An Ethereum standard for compliant security tokens that ensures only verified entities can hold and transfer digital assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Identity Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Connects verified identities to wallet addresses with on-chain claims
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Compliance Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Automatic verification of KYC, AML, and regulatory requirements
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Token transfers only between verified, compliant entities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Use This Platform Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose This Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade compliance meets blockchain innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="pt-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">KYC/AML Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in compliance verification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Identity-First</h3>
                <p className="text-sm text-muted-foreground">
                  On-chain identity management
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fully Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Meets regulatory standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Enterprise Grade</h3>
                <p className="text-sm text-muted-foreground">
                  Scalable and secure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to create compliant digital assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Register Identity</h3>
              <p className="text-sm text-muted-foreground">
                Create verified on-chain identities
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Issue Claims</h3>
              <p className="text-sm text-muted-foreground">
                Add KYC and compliance claims
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Create Tokens</h3>
              <p className="text-sm text-muted-foreground">
                Issue compliant ERC-3643 tokens
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Transfer Safely</h3>
              <p className="text-sm text-muted-foreground">
                Automatic compliance verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            Explore our demo to see ERC-3643 in action
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
            Explore Demo <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
