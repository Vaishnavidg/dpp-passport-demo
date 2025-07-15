import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, FileCheck, Zap, CheckCircle, ArrowDown } from "lucide-react";
import React from "react";

export default function Overview() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            A Trusted Framework for Regulated Digital Assets
          </h1>
          <p className="text-xl md:text-3xl mb-8 opacity-95 max-w-4xl mx-auto">
            Powered by ERC-3643 and Digital Product Passport standards
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Badge variant="secondary" className="px-6 py-3 text-base">
              Identity-First Compliance
            </Badge>
            <Badge variant="secondary" className="px-6 py-3 text-base">
              Regulated Token Transfers
            </Badge>
            <Badge variant="secondary" className="px-6 py-3 text-base">
              Supply Chain Transparency
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/30 hover:bg-white/10">
              Explore Tokens
            </Button>
          </div>
        </div>
      </div>

      {/* What is ERC-3643 Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What is ERC-3643?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ERC-3643 is an Ethereum standard that enables compliant, identity-controlled token transfers. 
              It creates a framework where only verified entities can hold and transfer digital assets, 
              ensuring regulatory compliance at every step.
            </p>
          </div>

          {/* ERC-3643 Flow Diagram */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
              {/* Claim Topic Registry */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Claim Topic Registry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600">
                    Define claim types (KYC, Country, Age, etc.)
                  </p>
                </CardContent>
              </Card>

              <div className="hidden lg:flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>

              {/* Trust Issuer Registry */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-yellow-700">Trust Issuer Registry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-600">
                    Authorize entities to issue specific claims (KYC providers, Government)
                  </p>
                </CardContent>
              </Card>

              <div className="hidden lg:flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>

              {/* Identity & Compliance */}
              <div className="space-y-4">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-green-700">Identity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-600">
                      Create user identities with claims
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-pink-50 border-pink-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-pink-700">Identity Registry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-pink-600">
                      Connect identities to wallets
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-purple-700">Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-purple-600">
                      Verify transfer eligibility
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mt-8">
              <ArrowDown className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <Card className="bg-orange-50 border-orange-200 max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl text-orange-700">ERC-3643 Token</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-600">
                    Compliant token that only allows transfers between verified identities with valid claims
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* How It Powers DPP Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Powers Digital Product Passports</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Digital Product Passports (DPP) track products throughout their lifecycle. 
              ERC-3643 ensures only authorized entities can update or transfer these digital records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Product Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manufacturers create DPP tokens for products with verified identity and sustainability claims
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Supply Chain Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Only verified suppliers, distributors, and retailers can receive and transfer DPP tokens
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Compliance Enforcement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatic verification of credentials, certifications, and regulatory requirements
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Consumer Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End consumers can verify product authenticity and sustainability through immutable records
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Use This Platform Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Use This Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on proven standards with enterprise-grade compliance and flexibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  KYC/AML Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built-in identity verification and compliance checks ensure regulatory adherence
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Fully Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Meets regulatory requirements for financial services and supply chain tracking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  Open Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Based on ERC-3643, ensuring interoperability and industry adoption
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  Identity-First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  On-chain identity management with flexible claim systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Modular Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Composable architecture allows custom compliance rules and integrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  Enterprise Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Scalable, secure, and auditable for large-scale deployments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple 4-step process from identity registration to compliant token transfers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Register Identity</h3>
              <p className="text-muted-foreground">
                Create on-chain identity contracts for users and connect them to wallet addresses
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Assign Claims</h3>
              <p className="text-muted-foreground">
                Trusted issuers verify and attach claims (KYC, certifications) to user identities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Issue Tokens</h3>
              <p className="text-muted-foreground">
                Create ERC-3643 tokens representing digital product passports with embedded compliance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4">Enforce Compliance</h3>
              <p className="text-muted-foreground">
                Automatic verification ensures only authorized entities can transfer tokens
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Explore our interactive demo to see how ERC-3643 enables compliant digital asset management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Explore Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white/30 hover:bg-white/10">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
