const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallout", function() {
  let Fallout, FalloutAttack, fallout, falloutAttack;
  let owner, attacker, alice, bob, signers;

  beforeEach(async function() {
    [owner, attacker, alice, bob, signers] = await ethers.getSigners();
    Fallout = await ethers.getContractFactory("Fallout");
    fallout = await Fallout.connect(owner).deploy();
    FalloutAttack = await ethers.getContractFactory("FalloutAttack");
    falloutAttack = await FalloutAttack.connect(attacker).deploy();
  });

  describe("deployment", function() {
    it("should set the attacker", async function() {
      expect(await falloutAttack.attacker()).to.equal(attacker.address);
    });
  });

  describe("attack", function() {
    beforeEach(async function() {
      await fallout.connect(alice).allocate({ value: ethers.utils.parseEther("1") });
      await fallout.connect(bob).allocate({ value: ethers.utils.parseEther("2") });
    });

    it("should transfer all the ether from Fallout contract", async function() {
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(ethers.utils.parseEther("3"));

      await falloutAttack.connect(attacker).attack(fallout.address);
      expect(await ethers.provider.getBalance(fallout.address)).to.equal(0);
      expect(await ethers.provider.getBalance(falloutAttack.address)).to.equal(ethers.utils.parseEther("3"));
    });
  });
});