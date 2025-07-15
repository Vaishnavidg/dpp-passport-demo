//Contract Address => 0x4959F911837b8c5FBE06E9c00259bA62469F7faD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityRegistry.sol";
import "./TrustedIssuersRegistry.sol";
import "./ClaimTopicsRegistry.sol";

contract Compliance {
    IdentityRegistry public identityRegistry;
    TrustedIssuersRegistry public trustedIssuers;
    ClaimTopicsRegistry public claimTopics;

    constructor(
        IdentityRegistry _identityRegistry,
        TrustedIssuersRegistry _trustedIssuers,
        ClaimTopicsRegistry _claimTopics) {
        identityRegistry = _identityRegistry;
        trustedIssuers = _trustedIssuers;
        claimTopics = _claimTopics;
    }
    
    function canTransfer(address from, address to, uint256) external view returns (bool){
        require(identityRegistry.isVerified(from),"Sender not verified");
        require(identityRegistry.isVerified(to) ,"Recipient not verified");

        address identityAddr = address(identityRegistry.identities(to));
        for(uint i =0; i< claimTopics.getClaimTopics().length; i++) {
            uint256 topic = claimTopics.getClaimTopics()[i];
            bool valid = IIdentity(identityAddr).isClaimValid(topic);
            if(!valid) return false;
        }
        return true;

    }
}