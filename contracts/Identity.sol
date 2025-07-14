//Contract Address => 0x3598D885fbCF9b5CE7969503D0aeD4d1fD02F58F

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Identity {

    //Structure of Claim 
    struct Claim {
        uint256 topic;
        address issuer;
        bytes signature;
        bytes data;
        uint256 validTo;
    }

    mapping(uint256 => Claim) public claims; //topic ->claim
     uint256[] public claimTopics;

    //function to add the claims
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
        claims[topic] = Claim(topic, issuer, signature, data, validTo);
    }

    //check if the claim is valid or not
    function isClaimValid(uint256 topic) external view returns (bool, uint256, uint256)  {
        Claim memory c = claims[topic];
         return (c.validTo > block.timestamp, c.validTo, block.timestamp);
}
}