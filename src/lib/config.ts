// ERC-3643 DApp Configuration

// Hardcoded admin address for demo purposes
export const ADMIN_ADDRESS = "0x742d35Cc6635C0532925a3b8D76845C9b9b3ad96";

// Contract addresses (replace with actual deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  IDENTITY_REGISTRY: "0x1234567890123456789012345678901234567890",
  COMPLIANCE_CONTRACT: "0x2345678901234567890123456789012345678901",
  TOKEN_CONTRACT: "0x3456789012345678901234567890123456789012",
  CLAIM_ISSUER_REGISTRY: "0x4567890123456789012345678901234567890123",
  TRUSTED_ISSUERS_REGISTRY: "0x5678901234567890123456789012345678901234",
};

// Common claim topics for ERC-3643
export const CLAIM_TOPICS = {
  KYC: 1,
  AML: 2,
  PRODUCT_AUTHENTICITY: 100,
  COUNTRY_VERIFICATION: 101,
  ACCREDITED_INVESTOR: 102,
  PROFESSIONAL_INVESTOR: 103,
};

// Country codes for compliance
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "CH", name: "Switzerland" },
];

// Educational messages for different actions
export const EDUCATIONAL_MESSAGES = {
  IDENTITY_REQUIRED:
    "You need a verified identity to interact with regulated tokens. This ensures compliance with KYC/AML requirements.",
  CLAIMS_REQUIRED:
    "Valid claims from trusted issuers are required to receive and transfer tokens. Claims verify your eligibility.",
  TRANSFER_BLOCKED:
    "Transfer blocked due to compliance rules. Both sender and receiver must have valid identities and claims.",
  ADMIN_ONLY:
    "This action is restricted to administrators who can manage the compliance framework.",
  COMPLIANCE_CHECK:
    "ERC-3643 automatically validates identity, claims, and compliance rules before allowing transfers.",
};

// Mock data for development/demo
export const MOCK_DATA = {
  claimTopics: [
    {
      id: 1,
      name: "KYC Verification",
      description: "Know Your Customer verification",
    },
    {
      id: 2,
      name: "AML Check",
      description: "Anti-Money Laundering verification",
    },
    {
      id: 100,
      name: "Product Authenticity",
      description: "Verifies product authenticity for DPP",
    },
  ],
  trustedIssuers: [
    {
      address: "0x1111111111111111111111111111111111111111",
      name: "KYC Provider Inc",
      topics: [1, 2],
    },
  ],
};
