//Contract Address = 0x2B30a59589df3C3679e1374ec4ae13d938f5621c

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

    mapping(uint256 => Claim) public claims; // topic -> claim
    Claim[] public allClaims;
    uint256[] public claimTopics;

    // Function to add a claim
    function addClaim(
        uint256 topic,
        address issuer,
        bytes memory signature,
        bytes memory data,
        uint256 validTo
    ) external {
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
}
