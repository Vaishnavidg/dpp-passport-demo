// Contract Address = 0xDaAEeCe678eb75fA3898606dD69262c255860eAF 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Define an interface for ClaimTopicsRegistry, so that we can validate topics.
// The automatically generated getter for topicExists is used.
interface IClaimTopicsRegistry {
    function topicExists(uint256 topic) external view returns (bool);
}

contract TrustedIssuersRegistry {
    address[] public issuers;
    // issuer => list of authorized claim topics
    mapping(address => uint256[]) public trustedIssuersTopics;
    mapping(address => string) public trustedIssuerName;
    mapping(address => bool) public isTrustedIssuer;
    address public admin;
    // Instance of the ClaimTopicsRegistry
    IClaimTopicsRegistry public claimTopicsRegistry;

    // Set the admin and claimTopicsRegistry address in the constructor.
    constructor(address _claimTopicsRegistry) {
        admin = msg.sender;
        claimTopicsRegistry = IClaimTopicsRegistry(_claimTopicsRegistry);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // Events for off-chain monitoring
    event TrustedIssuerAdded(address indexed issuer, uint256[] topics);
    event TrustedIssuerRemoved(address indexed issuer);
    event TopicRemoved(address indexed issuer, uint256 topic);

    // Add a trusted issuer with topics that must be available in the ClaimTopicsRegistry.
    function addTrustedIssuer(
        address issuer, 
        string memory name, 
        uint256[] memory topics
    ) external onlyAdmin {
        require(!isTrustedIssuer[issuer], "Issuer already exists");

        // Validate each provided topic exists in the claim topics registry.
        for (uint256 i = 0; i < topics.length; i++) {
            require(
                claimTopicsRegistry.topicExists(topics[i]),
                "One or more topics are not available in ClaimTopicsRegistry"
            );
        }

        isTrustedIssuer[issuer] = true;
        issuers.push(issuer);
        trustedIssuersTopics[issuer] = topics;
        trustedIssuerName[issuer] = name;

        emit TrustedIssuerAdded(issuer, topics);
    }

    // Remove an entire issuer from the registry.
    function removeTrustedIssuer(address issuer) external onlyAdmin {
        for (uint256 i = 0; i < issuers.length; ++i) {
            if (issuer == issuers[i]) {
                issuers[i] = issuers[issuers.length - 1];
                issuers.pop();
                break;
            }
        }

        delete trustedIssuersTopics[issuer];
        delete trustedIssuerName[issuer];
        isTrustedIssuer[issuer] = false;

        emit TrustedIssuerRemoved(issuer);
    }

    // Remove a specific topic from a trusted issuer.
    function removeTopicForIssuer(address issuer, uint256 topic) external {
        uint256[] storage topics = trustedIssuersTopics[issuer];
        for (uint256 i = 0; i < topics.length; i++) {
            if (topics[i] == topic) {
                topics[i] = topics[topics.length - 1];
                topics.pop();
                emit TopicRemoved(issuer, topic);
                return;
            }
        }
    }

    // Check if an issuer is trusted for a given claim topic.
    function isIssuerTrusted(address issuer, uint256 topic) public view returns (bool) {
        uint256[] memory topics = trustedIssuersTopics[issuer];
        for (uint256 i = 0; i < topics.length; i++) {
            if (topics[i] == topic) {
                return true;
            }
        }
        return false;
    }

    // Get the topics an issuer is trusted for.
    function getTopicsForIssuer(address issuer) public view returns (uint256[] memory) {
        return trustedIssuersTopics[issuer];
    }

    // Get all issuers’ details: addresses, the array of topics for each issuer, and their names.
    function getAllIssuersDetails() public view returns (
        address[] memory, 
        uint256[][] memory, 
        string[] memory
    ) {
        uint256 length = issuers.length;
        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        uint256[][] memory allTopics = new uint256[][](length);
         
        for (uint256 i = 0; i < length; i++) {
            address issuer = issuers[i];
            addresses[i] = issuer;
            names[i] = trustedIssuerName[issuer];
            allTopics[i] = trustedIssuersTopics[issuer];
        }

        return (addresses, allTopics, names);
    }

    // Get the name of an issuer by their address.
    function getIssuerName(address issuer) public view returns (string memory) {
        if (!isTrustedIssuer[issuer]) return "Not Trusted Issuer";
        return trustedIssuerName[issuer]; 
    }
}
