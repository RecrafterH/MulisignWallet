const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const main = async () => {
  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.deployed();

  const MultiSig = await ethers.getContractFactory("MultiSig");
  const multiSig = await MultiSig.deploy(
    [
      "0x2Df3EBe4280dC7262D9644ccd5dBC41c0DE293c8",
      "0xc3974256C8bE7e81E6B3e92e7BC6A28a667b769A",
      "0x7e6e41BA05FdBE4e1617cfB521154550537255df",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    ],
    2,
    { value: parseEther("0.5") }
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
