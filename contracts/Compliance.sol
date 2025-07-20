//contract Address => 0x04f3A33B4fE27aC6a6611E125f16b55eeD16aa12
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityRegistry.sol";
import "./TrustIssuersRegistry.sol";
import "./ClaimTopicsRegistry.sol";

interface IExtendedIdentity {
    function isClaimValid(uint256 topic) external view returns (bool, uint256, uint256);
}

contract Compliance {
    IdentityRegistry public identityRegistry;
    TrustedIssuersRegistry public trustedIssuers;
    ClaimTopicsRegistry public claimTopics;

    uint256 public constant MAX_TRANSFER_LIMIT = 50 wei; // 50 tokens

    constructor(
        IdentityRegistry _identityRegistry,
        TrustedIssuersRegistry _trustedIssuers,
        ClaimTopicsRegistry _claimTopics
    ) {
        identityRegistry = _identityRegistry;
        trustedIssuers = _trustedIssuers;
        claimTopics = _claimTopics;
    }

    function canTransfer(address from, address to, uint256 amount) external view returns (bool) {
        require(identityRegistry.isVerified(from), "Sender not verified");
        require(identityRegistry.isVerified(to), "Recipient not verified");

        // Rule 1: Max transfer limit check
        require(amount <= MAX_TRANSFER_LIMIT, "Transfer exceeds max limit of 50 tokens");

        // Rule 2: Check same country
        uint16 fromCountry = identityRegistry.investorCountry(from);
        uint16 toCountry = identityRegistry.investorCountry(to);
        require(fromCountry == toCountry, "Sender and recipient must be from the same country");

// uint256[] memory requiredTopics = claimTopics.getClaimTopics();
//     address fromIdentity = address(identityRegistry.identities(from));
//     address toIdentity = address(identityRegistry.identities(to));

//     for (uint i = 0; i < requiredTopics.length; i++) {
//         uint256 topic = requiredTopics[i];

//       (bool fromValid, , ) = IExtendedIdentity(fromIdentity).isClaimValid(topic);
// (bool toValid, , ) = IExtendedIdentity(toIdentity).isClaimValid(topic);

//         if (!fromValid || !toValid) {
//             return false;
//         }
//     }

    return true;
    }
}
