import { Badge } from "@/components/ui/badge";
import React from "react";

export default function Overview() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ERC-3643 Digital Product Passport
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Identity-Controlled Compliance for Supply Chain Transparency
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="secondary" className="px-4 py-2">
              Identity Management
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Compliance Control
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Supply Chain Tracking
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}
