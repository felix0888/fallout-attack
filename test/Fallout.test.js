const { expect } = require("chai");
const { ethers } = require("hardhat");

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

describe("Fallout", function() {
  let Fallout;
  let fallout;
  let owner;
  let alice;
  let bob;
  let carol;
  let signers;

  beforeEach(async function() {
    Fallout = await ethers.getContractFactory("Fallout");
    fallout = await Fallout.deploy();
    [owner, alice, bob, carol, ...signers] = await ethers.getSigners();
  });


  describe("constructor", function() {
    it("should not call Fal1out", async function() {
      expect(await fallout.owner()).to.equal(ADDRESS_ZERO);
      expect(await fallout.allocatorBalance(owner.address)).to.equal(0);
    });
  });

  describe("#allocate, #sendAllocation, #allocatorBalance", function() {
    it("should update/return allocations variable", async function() {
      await fallout.allocate({ value: 10 });
      expect(await fallout.allocatorBalance(owner.address)).to.equal(10);

      await fallout.connect(alice).allocate({ value: 20 });
      expect(await fallout.allocatorBalance(alice.address)).to.equal(20);
      await fallout.connect(alice).allocate({ value: 30 });
      expect(await fallout.allocatorBalance(alice.address)).to.equal(50);
    });

    it("should send allocator's ether back", async function() {
      await fallout.connect(alice).allocate({ value: 10 });
      await fallout.connect(bob).allocate({ value: 20 });
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(30);

      await fallout.sendAllocation(alice.address);
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(20);
      await fallout.sendAllocation(bob.address);
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(0);
    });
  });

  describe("#collectAllocations", function() {
    beforeEach(async function() {
      await fallout.connect(owner).Fal1out({ value: 100 });
      await fallout.connect(alice).allocate({ value: 10 });
      await fallout.connect(bob).allocate({ value: 20 });
      await fallout.connect(carol).allocate({ value: 40 });
    });

    it("should be reverted if non-owner calls", async function() {
      expect(
        fallout.connect(alice).collectAllocations()
      ).to.be.revertedWith(
        'caller is not the owner'
      );
    });

    it("should all the allocated ethers to the owner", async function() {
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(170);
      await fallout.collectAllocations();
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(0);
    });
  });
});
