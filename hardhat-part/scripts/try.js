const { formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const main = async () => {
  const [owner] = await ethers.getSigners();
  const testContract = await ethers.getContractAt(
    "TestToken",
    "0xd05544D7cD59c87b6422034B987128BD78Bb2146",
    owner
  );

  const multisigContract = await ethers.getContractAt(
    "MultiSig",
    "0xfdDCCe789cB265b0b54dF1Eb386a8bB87ECaeC62",
    owner
  );

  let balance = await testContract.balanceOf(
    "0xc3974256C8bE7e81E6B3e92e7BC6A28a667b769A"
  );
  balance = formatEther(balance.toString());
  console.log(balance.toString());

  const trans = await multisigContract.getTransaction(0);
  console.log(trans);

  const sign = await multisigContract.getOwner(3);
  console.log(sign);
  /*   let balance = await ethers.provider.getBalance(
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
  );
  balance = formatEther(balance.toString());
  console.log(balance); */
};

main();
