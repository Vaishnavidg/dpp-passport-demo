//Contract Address => 0xF40E0600F296364Cde72b71A5a51869252B67c37

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIdentity {
    function isClaimValid(uint256 topic) external view returns (bool);
}

contract IdentityRegistry {
    mapping(address => IIdentity) public identities;
    mapping(address => uint16) public investorCountry;

    function registerIdentity(address user, IIdentity identity, uint16 country) external {
        identities[user] = identity;
        investorCountry[user] = country;
    }

    function deleteIdentity(address user) external {
        delete identities[user];
        delete investorCountry[user];
    }

    function isVerified(address user) external view returns (bool) {
        return address(identities[user]) !=address(0);
    }


}