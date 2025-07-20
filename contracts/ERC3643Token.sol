//Contract Address = 0x61194488D14C1b159D7f0a290d3b74ec80AC98f2

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Compliance.sol";

contract ERC3643Token is ERC20 {
    Compliance public compliance;
    address public issuer;

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount);

    constructor(string memory name, string memory symbol, Compliance _compliance)
        ERC20(name, symbol)
    {
        compliance = _compliance;
        issuer = msg.sender;
    }

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer");
        _;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(compliance.canTransfer(msg.sender, to, amount), "Transfer not compliant");
        return super.transfer(to, amount);
    }

    function mint(address to, uint256 amount) external onlyIssuer {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function forcedTransfer(address from, address to, uint256 amount) external onlyIssuer {
        _transfer(from, to, amount);
        emit ForcedTransfer(from, to, amount);
    }
}
