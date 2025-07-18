//Contract Address = 0x1C3AF6B9A84eB8786cF6EAD08Be2176aE29b3589
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IClaimTopicsRegistry {
    function topicExists(uint256 topic) external view returns (bool);
}

contract Identity {

    // Structure of Claim 
    struct Claim {
        uint256 topic;
        address issuer;
        bytes signature;
        bytes data;
        uint256 validTo;
    }
// Structure of Claim Request
    struct ClaimRequest {
        address user;
        address issuer;
        string claimType;
        bool fulfilled;
    }

    IClaimTopicsRegistry public claimTopicsRegistry;
     // Access control
    address public owner;
    mapping(address => bool) public authorizedIssuers;


constructor(address _claimTopicsRegistry) {
    claimTopicsRegistry = IClaimTopicsRegistry(_claimTopicsRegistry);
      owner = msg.sender;
}


    // Events
    event ClaimAdded(uint256 indexed topic, address indexed issuer, uint256 validTo);
    event ClaimRemoved(uint256 indexed topic);
    event IssuerAuthorized(address indexed issuer, bool authorized);
    event ClaimRequested(uint256 indexed requestId, address indexed user, address indexed issuer, string claimType);


    // Claim storage
    mapping(uint256 => Claim) public claims; // topic -> claim
    Claim[] public allClaims;
    uint256[] public claimTopics;

    // Claim Requests
    mapping(uint256 => ClaimRequest) public requests;
    uint256 public requestCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Only authorized issuer can add claims");
        _;
    }

    // --- Claim Logic ---
function addClaim(
    uint256 topic,
    address issuer,
    bytes memory signature,
    bytes memory data,
    uint256 validTo
) external onlyAuthorizedIssuer {
    require(claimTopicsRegistry.topicExists(topic), "Claim topic not registered");

    // Only add to topics array if topic is new
    if (claims[topic].validTo == 0) {
        claimTopics.push(topic);
    }

    Claim memory newClaim = Claim(topic, issuer, signature, data, validTo);
    claims[topic] = newClaim;
    allClaims.push(newClaim);

    emit ClaimAdded(topic, issuer, validTo);
}


    function isClaimValid(uint256 topic) external view returns (bool, uint256, uint256) {
        Claim memory c = claims[topic];
        return (c.validTo > block.timestamp, c.validTo, block.timestamp);
    }

  // Get all claim requests for a specific issuer
function getRequestsForIssuer(address issuer) external view returns (
    uint[] memory ids,
    address[] memory users,
    string[] memory claimTypes,
    bool[] memory fulfilledStatuses
) {
    uint count = 0;

    // First, count how many requests are for this issuer
    for (uint i = 0; i < requestCount; i++) {
        if (requests[i].issuer == issuer) {
            count++;
        }
    }

    // Initialize return arrays
    ids = new uint[](count);
    users = new address[](count);
    claimTypes = new string[](count);
    fulfilledStatuses = new bool[](count);

    uint index = 0;
    for (uint i = 0; i < requestCount; i++) {
        if (requests[i].issuer == issuer) {
            ids[index] = i;
            users[index] = requests[i].user;
            claimTypes[index] = requests[i].claimType;
            fulfilledStatuses[index] = requests[i].fulfilled;
            index++;
        }
    }
}


    // --- Claim Request Logic ---

    function submitClaimRequest(address issuer, string calldata claimType) external {
        requests[requestCount] = ClaimRequest(msg.sender, issuer, claimType, false);
        emit ClaimRequested(requestCount, msg.sender, issuer, claimType);
        requestCount++;
    }

    function getRequestsByUser(address user) external view returns (
        uint256[] memory ids,
        address[] memory issuers,
        string[] memory claimTypes,
        bool[] memory fulfilledStatuses
    ) {
        uint256 count = 0;

        // First, count matching requests
        for (uint256 i = 0; i < requestCount; i++) {
            if (requests[i].user == user) {
                count++;
            }
        }

        // Allocate arrays
        ids = new uint256[](count);
        issuers = new address[](count);
        claimTypes = new string[](count);
        fulfilledStatuses = new bool[](count);

        // Populate arrays
        uint256 index = 0;
        for (uint256 i = 0; i < requestCount; i++) {
            if (requests[i].user == user) {
                ids[index] = i;
                issuers[index] = requests[i].issuer;
                claimTypes[index] = requests[i].claimType;
                fulfilledStatuses[index] = requests[i].fulfilled;
                index++;
            }
        }
    }

    // --- Admin Controls ---

    function setIssuerAuthorization(address issuer, bool authorized) external onlyOwner {
        authorizedIssuers[issuer] = authorized;
        emit IssuerAuthorized(issuer, authorized);
    }

    function isIssuerAuthorized(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer] || issuer == owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}
