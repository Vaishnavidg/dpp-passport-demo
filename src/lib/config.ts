// ERC-3643 DApp Configuration

// Hardcoded admin address
export const ADMIN_ADDRESS = "0x35C6e706EE23CD898b2C15fEB20f0fE726E734D2";

// Contract addresses
export const CONTRACT_ADDRESSES = {
  // Testnet Addresses
  // CLAIM_TOPIC_REGISTRY_ADDRESS: "0x21938D85Bc60a5468DFb886CCc1958bF14f65b9b",
  // TRUST_ISSUER_REGISTRY_ADDRESS: "0x1315B07932951826fF4b27e25cb044477E3E7230",
  // IDENTITY_ADDRESS: "0xaFaa19bB89F3a05D6145D6f9d4D0C249be04BE5A",
  // IDENTITY_REGISTRY_ADDRESS: "0xAbC1da404e43560321Ab79C127f7b7B4aBDca346",
  // COMPLIANCE_CONTRACT_ADDRESS: "0x234F5429A3712e6e13395d401e61141c60805e41",
  // ERC3643_CONTRACT_ADDRESS: "0x7498afa6637ce9F4C385bA43229d84a54972691c",

  //Mainnet
  CLAIM_TOPIC_REGISTRY_ADDRESS: "0x4B5f49efF0e0Fa117E321B88Cd8B035d3F019064",
  TRUST_ISSUER_REGISTRY_ADDRESS: "0x635E7c57472927d0352D3e23C547E89d4e64e69E",
  IDENTITY_ADDRESS: "0x7AE343c9B7D925F1988db732D3ca29485601fFBD",
  IDENTITY_REGISTRY_ADDRESS: "0xB632EF87Ee0720c8cBa3739BcBf5bA1b25363d8f",
  COMPLIANCE_CONTRACT_ADDRESS: "0xD7317224Aa0a5497492342114CB3750Eb0836457",
  ERC3643_CONTRACT_ADDRESS: "0xE27Bab226884aa54136e05868a4EAcfC3b60c637",
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
