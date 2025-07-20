// ERC-3643 DApp Configuration

// Hardcoded admin address
export const ADMIN_ADDRESS = "0x35C6e706EE23CD898b2C15fEB20f0fE726E734D2";

// Contract addresses
export const CONTRACT_ADDRESSES = {
  CLAIM_TOPIC_REGISTRY_ADDRESS: "0xa3c00c99d057b63749faAd30481c29c7F18B4f9b",
  TRUST_ISSUER_REGISTRY_ADDRESS: "0xB6fCbBa45A53fDc9429E804b6A887440d9b1E14F",
  IDENTITY_ADDRESS: "0x55f34EB95bbcCb2E80FD4E65F47eB62B9b36AF53",
  IDENTITY_REGISTRY_ADDRESS: "0xaebB27fde88161a61E39e1f650a2bc5d89954e07",
  COMPLIANCE_CONTRACT_ADDRESS: "0x4E7030be301424544b110b59cA4b37801243887A",
  ERC3643_CONTRACT_ADDRESS: "0x6E7C092A3Ce028D45a243a3AFB9FdE2Abb1a56C9",
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
