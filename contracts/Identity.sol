//Contract Address = 0xa02B86A9DBE8049d53EEFD1f5560d5fF5B6c7978

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Identity {

    // Structure of Claim 
    struct Claim {
        uint256 topic;
        address issuer;
        bytes signature;
        bytes data;
        uint256 validTo;
    }

       // Events
    event ClaimAdded(uint256 indexed topic, address indexed issuer, uint256 validTo);
    event ClaimRemoved(uint256 indexed topic);
    event IssuerAuthorized(address indexed issuer, bool authorized);

   // Access control
    address public owner;
    mapping(address => bool) public authorizedIssuers;

     constructor() {
        owner = msg.sender;
    }

    mapping(uint256 => Claim) public claims; // topic -> claim
    Claim[] public allClaims;
    uint256[] public claimTopics;

     modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Only authorized issuer can add claims");
        _;
    }

    // Function to add a claim
    function addClaim(
        uint256 topic,
        address issuer,
        bytes memory signature,
        bytes memory data,
        uint256 validTo
    ) external onlyAuthorizedIssuer {
        // Only add to topics array if topic is new
        if (claims[topic].validTo == 0) {
            claimTopics.push(topic);
        }

        Claim memory newClaim = Claim(topic, issuer, signature, data, validTo);
        claims[topic] = newClaim;
        allClaims.push(newClaim);
    }

    // Check if the claim is valid or not
    function isClaimValid(uint256 topic) external view returns (bool, uint256, uint256)  {
        Claim memory c = claims[topic];
        return (c.validTo > block.timestamp, c.validTo, block.timestamp);
    }

    // Get all claims
    function getAllClaims() external view returns (
        uint256[] memory topics,
        address[] memory issuers,
        bytes[] memory signatures,
        bytes[] memory datas,
        uint256[] memory validsTo
    ) {
        uint256 len = allClaims.length;
        topics = new uint256[](len);
        issuers = new address[](len);
        signatures = new bytes[](len);
        datas = new bytes[](len);
        validsTo = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            Claim memory c = allClaims[i];
            topics[i] = c.topic;
            issuers[i] = c.issuer;
            signatures[i] = c.signature;
            datas[i] = c.data;
            validsTo[i] = c.validTo;
        }
    }

      // Authorize/unauthorize issuers
    function setIssuerAuthorization(address issuer, bool authorized) external onlyOwner {
        authorizedIssuers[issuer] = authorized;
        emit IssuerAuthorized(issuer, authorized);
    }

    // Check if an issuer is authorized
    function isIssuerAuthorized(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer] || issuer == owner;
    }

     // Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}
