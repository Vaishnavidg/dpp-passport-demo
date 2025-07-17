// Contract Address = 0x9e1EFE110aC3615ad3B669CC6a424e24e41bFd05

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIdentity {
    function isClaimValid(uint256 topic) external view returns (bool);
}

contract IdentityRegistry {
    mapping(address => IIdentity) public identities;
    mapping(address => uint16) public investorCountry;

    address[] public registeredUsers; // New: store registered user addresses
    mapping(address => bool) public isRegistered; // New: check if already registered

    function registerIdentity(address user, IIdentity identity, uint16 country) external {
        if (!isRegistered[user]) {
            registeredUsers.push(user);
            isRegistered[user] = true;
        }

        identities[user] = identity;
        investorCountry[user] = country;
    }

    function deleteIdentity(address user) external {
        delete identities[user];
        delete investorCountry[user];
        isRegistered[user] = false;
        // Note: We are not removing from registeredUsers array to save gas
    }

    function isVerified(address user) external view returns (bool) {
        return address(identities[user]) != address(0);
    }

    // Get total registered user count
    function getUserCount() external view returns (uint256) {
        return registeredUsers.length;
    }

    //  Get user info at index (for pagination)
    function getUserAt(uint256 index) external view returns (
        address user,
        address identity,
        uint16 country
    ) {
        user = registeredUsers[index];
        identity = address(identities[user]);
        country = investorCountry[user];
    }

    // Return all users in one go — only use if array is small
    function getAllUsers() external view returns (
        address[] memory users,
        address[] memory identityAddrs,
        uint16[] memory countries
    ) {
        uint256 count = registeredUsers.length;
        users = new address[](count);
        identityAddrs = new address[](count);
        countries = new uint16[](count);

        for (uint256 i = 0; i < count; i++) {
            address user = registeredUsers[i];
            users[i] = user;
            identityAddrs[i] = address(identities[user]);
            countries[i] = investorCountry[user];
        }
    }
}
