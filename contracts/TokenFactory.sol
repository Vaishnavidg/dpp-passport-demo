//Contract Address => 0x014c819c9b01510C14d597ca19CDA699FE8C0BB1

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/ERC3643Token.sol";
import "contracts/Compliance.sol";

contract TokenFactory {
 event TokenCreated(address token, address issuer);

 function deployToken(
    string memory name,
    string memory symbol,
    Compliance compliance
 )external returns (address) {
    ERC3643Token token = new ERC3643Token(name,symbol,compliance);
      address tokenAddr = address(token);
      emit TokenCreated(tokenAddr,msg.sender);
    return tokenAddr;
 }
}