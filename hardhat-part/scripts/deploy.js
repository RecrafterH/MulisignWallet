const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const main = async () => {
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.deployed();

  const MultiSig = await ethers.getContractFactory("MultiSig");
  const multiSig = await MultiSig.deploy(
    [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    ],
    2,
    { value: parseEther("1000") }
  );
  await multiSig.deployed;

  await testToken.transfer(multiSig.address, parseEther("10000"));
  console.log("TestToken deployed at: ", testToken.address);
  console.log("Multisig deployed at: ", multiSig.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
