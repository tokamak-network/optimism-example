// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("MyERC20", "MERC") {
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
