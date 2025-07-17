//Contract Address => 0xe313673e15aF30fd6E21C341554553E1D11CCb74

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Compliance.sol";

contract ERC3643Token is ERC20 {
    Compliance public compliance;
    address public issuer;

    constructor(string memory name, string memory symbol, Compliance _compliance)
    ERC20(name, symbol){
        compliance = _compliance;
        issuer = msg.sender;
    }

    modifier onlyIssuer() {
    require(msg.sender == issuer, "Only issuer");
    _;
}

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(compliance.canTransfer(msg.sender, to, amount),"Transfer not compliant");
        return super.transfer(to, amount);
    }

    function mint(address to, uint256 amount) external onlyIssuer {
         _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender,amount);
    }

    function forcedTransfer(address from, address to, uint256 amount) external onlyIssuer {
        _transfer(from, to, amount);  // bypasses compliance and allowance checks

    }
}