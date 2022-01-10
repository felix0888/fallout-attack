# Fallout Attack
Smart Contract Security Practice | Lv2 Fallout Attack

```
!!! DON'T TRY ON MAINNET !!!
```

## SUMMARY
Look carefully at the contract's code below. You find a security risk on the contract and expose it.

#### You will beat this level if
- you claim ownership of the contract
- you reduce its balance to 0

#### Things that might help
- Interface
- How to interact the smart contract by using Interface

## SMART CONTRACT CODE
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract Fallout {
  
  using SafeMath for uint256;
  mapping (address => uint) allocations;
  address payable public owner;


  /* constructor */
  function Fal1out() public payable {
    owner = msg.sender;
    allocations[owner] = msg.value;
  }

  modifier onlyOwner {
	        require(
	            msg.sender == owner,
	            "caller is not the owner"
	        );
	        _;
	    }

  function allocate() public payable {
    allocations[msg.sender] = allocations[msg.sender].add(msg.value);
  }

  function sendAllocation(address payable allocator) public {
    require(allocations[allocator] > 0);
    allocator.transfer(allocations[allocator]);
  }

  function collectAllocations() public onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function allocatorBalance(address allocator) public view returns (uint) {
    return allocations[allocator];
  }
}
```

## HOW TO EXPOSE THE SECURITY RISK?
#### Fal1out method changes the owner of the contract, so how can we make it happen?
The source code might trick you think `Fal1out` as constructor, then what is the difference between `Fallout` and `Fal1out`.
From the latter you'll find `1` instead of `l`, so you can simply call the `Fal1out` function which is not the constructor of the contract.
Then nothing to learn from this chapter? It depends on your thought.

Some simple mistakes like type causes big problems you never expected.
You see the above contract code again, any `hacker` can take the all the ether on the contract.

## DEPLOY & TEST
#### Installation
```
npm install
npx hardhat node
```

#### Deployment
```
npx hardhat run --network [NETWORK-NAME] scripts/deploy.js
```

#### Test
```
npx hardhat test
```

You can test fallout on the local hardhat node as well.
