const { expect } = require("chai");
const { formatEther, parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("unit tests", () => {
  let MultisigContract, multisigContract, TestToken, testToken;

  beforeEach(async () => {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    const owners = [owner.address, user1.address, user2.address, user3.address];
    MultisigContract = await ethers.getContractFactory("MultiSig");
    multisigContract = await MultisigContract.deploy(owners, 2, {
      value: parseEther("200"),
    });
    await multisigContract.deployed();

    TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy();
    await testToken.deployed();
  });
  it("Reverts if someone send a transaction who isnt an owner", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await expect(
      multisigContract
        .connect(user4)
        .submitTransaction(user1.address, 100, "0x")
    ).to.be.revertedWith("Only owner can confirm a transaction");
  });
  it("lets the owner submit a transaction", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await multisigContract
      .connect(user1)
      .submitTransaction(user1.address, parseEther("100"), "0x");

    let num = await multisigContract.getConfirmationsCount(0);
    await expect(num.toString()).to.equal("1");
  });
  it("lets execute the transaction after 2 confirmations", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await multisigContract.submitTransaction(
      user1.address,
      parseEther("100"),
      "0x"
    );
    const tx = await multisigContract.connect(user2).confirmTransaction(0);
    await tx.wait();
    let balance = formatEther(
      (await ethers.provider.getBalance(user1.address)).toString()
    );
    await expect(Math.round(balance).toString()).to.equal("10100");
  });
  it("lets execute an transaction with calldata after 2 confirmations", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await testToken.transfer(multisigContract.address, parseEther("2000"));
    let ABI = ["function transfer(address to, uint amount)"];
    let iface = new ethers.utils.Interface(ABI);
    let data = iface.encodeFunctionData("transfer", [
      user4.address.toString(),
      parseEther("159"),
    ]);

    await multisigContract.submitTransaction(testToken.address, 0, data);

    await multisigContract.connect(user1).confirmTransaction(0);

    const balance = formatEther(
      (await testToken.balanceOf(user4.address)).toString()
    );
    await expect(balance.toString()).to.equal("159.0");
  });
  it("lets the contract add a new owner", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    let ABI = ["function addOwner(address newOwner)"];
    let iface = new ethers.utils.Interface(ABI);
    let data = iface.encodeFunctionData("addOwner", [user4.address.toString()]);
    await multisigContract.submitTransaction(multisigContract.address, 0, data);
    await multisigContract.connect(user1).confirmTransaction(0);
    const answer = await multisigContract.connect(user4).isOwner();
    await expect(answer).to.equal(true);
  });
  it("Reverts if someone expect the contract want to add a signer", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await expect(multisigContract.addOwner(user4.address)).to.be.revertedWith(
      "You don't have the permission to call this transaction!"
    );
  });
  it("Reverts if you want to add an owner who is already an owner", async () => {
    const [owner, user1, user2] = await ethers.getSigners();
    let ABI = ["function addOwner(address newOwner)"];
    let iface = new ethers.utils.Interface(ABI);
    let data = iface.encodeFunctionData("addOwner", [user2.address.toString()]);
    await multisigContract.submitTransaction(multisigContract.address, 0, data);
    await expect(
      multisigContract.connect(user1).confirmTransaction(0)
    ).to.be.revertedWith("Ups something went wrong");
  });

  it("Let the contract remove an owner,", async () => {
    const [owner, user1, user2, user3] = await ethers.getSigners();
    let ABI = ["function removeOwner(address oldOwner)"];
    let iface = new ethers.utils.Interface(ABI);
    let data = iface.encodeFunctionData("removeOwner", [
      user2.address.toString(),
    ]);
    await multisigContract.submitTransaction(multisigContract.address, 0, data);
    await multisigContract.connect(user1).confirmTransaction(0);
    const status = await multisigContract.isAnOwner(user2.address);
    await expect(status).to.equal(false);
  });
  it("Won't let someone expect the contract call the removeOnwer function", async () => {
    const [owner] = await ethers.getSigners();
    await expect(
      multisigContract.removeOwner(owner.address)
    ).to.be.revertedWith(
      "You don't have the permission to call this transaction!"
    );
  });
  it("lets approve a transaction in the past", async () => {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    await multisigContract
      .connect(user1)
      .submitTransaction(user1.address, parseEther("20"), "0x");
    await multisigContract
      .connect(user1)
      .submitTransaction(user4.address, parseEther("120"), "0x");
    await multisigContract.connect(user2).confirmTransaction(1);
    console.log("jo");
    await multisigContract.connect(user2).confirmTransaction(0);
    let balance = await ethers.provider.getBalance(user1.address);
    balance = formatEther(balance.toString());
    console.log(balance.toString());
    let num = await multisigContract.getConfirmationsCount(0);
    await expect(num.toString()).to.equal("1");
  });
});
