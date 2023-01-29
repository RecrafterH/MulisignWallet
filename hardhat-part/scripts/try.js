const { formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

const main = async () => {
  const [owner] = await ethers.getSigners();
  const testContract = await ethers.getContractAt(
    "TestToken",
    "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    owner
  );

  const multisigContract = await ethers.getContractAt(
    "MultiSig",
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    owner
  );

  /* let balance = await testContract.balanceOf(
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  );
  balance = formatEther(balance.toString());
  console.log(balance.toString());

  const trans = await multisigContract.getTransaction(0);
  console.log(trans); */
  let balance = await ethers.provider.getBalance(
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
  );
  balance = formatEther(balance.toString());
  console.log(balance);
};

main();
