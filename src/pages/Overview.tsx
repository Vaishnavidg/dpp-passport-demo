import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, CheckCircle } from "lucide-react";
import React from "react";
import { FeatureCard } from "@/components/ui/feature-card";
import { StepIndicator } from "@/components/ui/step-indicator";

export default function Overview() {
  return (
    <div className="min-h-screen">
      {/* What is ERC-3643 Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is ERC-3643?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              An Ethereum standard for compliant security tokens that ensures
              only verified entities can hold and transfer digital assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={Users}
              title="Identity Registry"
              description="Connects verified identities to wallet addresses with on-chain claims"
              size="lg"
            />
            <FeatureCard
              icon={Shield}
              title="Compliance Layer"
              description="Automatic verification of KYC, AML, and regulatory requirements"
              size="lg"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Secure Transfers"
              description="Token transfers only between verified, compliant entities"
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Why Use This Platform Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose This Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade compliance meets blockchain innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Shield}
              title="KYC/AML Ready"
              description="Built-in compliance verification"
              size="md"
              className="p-6"
            />
            <FeatureCard
              icon={Users}
              title="Identity-First"
              description="On-chain identity management"
              size="md"
              className="p-6"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Fully Compliant"
              description="Meets regulatory standards"
              size="md"
              className="p-6"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Grade"
              description="Scalable and secure"
              size="md"
              className="p-6"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to create compliant digital assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StepIndicator
              stepNumber={1}
              title="Register Identity"
              description="Create verified on-chain identities"
            />
            <StepIndicator
              stepNumber={2}
              title="Issue Claims"
              description="Add KYC and compliance claims"
            />
            <StepIndicator
              stepNumber={3}
              title="Create Tokens"
              description="Issue compliant ERC-3643 tokens"
            />
            <StepIndicator
              stepNumber={4}
              title="Transfer Safely"
              description="Automatic compliance verification"
            />
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
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
