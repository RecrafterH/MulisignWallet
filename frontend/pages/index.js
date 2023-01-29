import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Flex,
} from "@chakra-ui/react";
import Header from "../components/header";
import Footer from "@/components/footer";
import { ADDRESS_MULTISIG, ABI_MULTISIG } from "@/constants/constants";
import { Contract, ethers } from "ethers";
import {
  parseEther,
  formatEther,
  getJsonWalletAddress,
} from "ethers/lib/utils";
import Transaction from "./Transaction";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [latestTransaction, setLatestTransaction] = useState([]);
  const [allOwner, setAllOwner] = useState([]);
  const [latestApprove, setLatestApprove] = useState(true);
  const [searchTransaction, setSearchTransaction] = useState([]);
  const [searchApprove, setSearchApprove] = useState(true);
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const sendTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );

      const address = document.getElementById("ethAddress").value;
      let amount = document.getElementById("ethAmount").value;
      amount = parseEther(amount.toString());

      const tx = await multiSigContract.submitTransaction(
        address,
        amount,
        "0x"
      );
      await tx.wait();
      ref.current.value = "";
      ref1.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const sendTokenTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );

      const tokenAddress = document.getElementById("tokenAddress").value;
      const address = document.getElementById("receiverAddress").value;
      let amount = document.getElementById("tokenAmount").value;
      amount = parseEther(amount.toString());

      let ABI = ["function transfer(address to, uint amount)"];
      let iface = new ethers.utils.Interface(ABI);
      let data = iface.encodeFunctionData("transfer", [address, amount]);

      const tx = await multiSigContract.submitTransaction(
        tokenAddress,
        0,
        data
      );
      await tx.wait();
      ref2.current.value = "";
      ref3.current.value = "";
      ref4.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const approval = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );
      let num = await multiSigContract.transactionCount();
      num = Number(num) - 1;
      const tx = await multiSigContract.confirmTransaction(num);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const approvalSearch = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );
      let num = document.getElementById("transactionNumber").value;

      const tx = await multiSigContract.confirmTransaction(Number(num));
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const addOwner = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );
      const address = document.getElementById("changingOwner").value;
      let ABI = ["function addOwner(address newOwner)"];
      let iface = new ethers.utils.Interface(ABI);
      let data = iface.encodeFunctionData("addOwner", [address]);
      const tx = await multiSigContract.submitTransaction(
        ADDRESS_MULTISIG,
        0,
        data
      );
      await tx.wait();
      ref5.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const removeOwner = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        signer
      );
      const address = document.getElementById("changingOwner").value;
      let ABI = ["function removeOwner(address oldOwner)"];
      let iface = new ethers.utils.Interface(ABI);
      let data = iface.encodeFunctionData("removeOwner", [address]);
      const tx = await multiSigContract.submitTransaction(
        ADDRESS_MULTISIG,
        0,
        data
      );
      await tx.wait();
      ref5.current.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  const getLatestTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        provider
      );
      const num = await multiSigContract.transactionCount();
      const transactionData = await multiSigContract.getTransaction(
        Number(num) - 1
      );
      const destination = transactionData.destination;
      const value = formatEther(transactionData.value.toString());
      let executed = transactionData.executed;
      if (executed == true) {
        executed = "Executed";
        setLatestApprove(true);
      } else {
        executed = "Not executed";
        setLatestApprove(false);
      }
      const data = transactionData.data;
      const transaction = {
        destination,
        value,
        executed,
        data,
      };
      setLatestTransaction([transaction]);
    } catch (error) {
      console.error(error);
    }
  };

  const getSearchTransaction = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        provider
      );
      let num = document.getElementById("transactionNumber").value;
      const transactionData = await multiSigContract.getTransaction(
        Number(num)
      );
      const destination = transactionData.destination;
      const value = formatEther(transactionData.value.toString());
      let executed = transactionData.executed;
      if (executed == true) {
        executed = "Executed";
        setSearchApprove(true);
      } else {
        executed = "Not executed";
        setSearchApprove(false);
      }
      const data = transactionData.data;
      const transaction = {
        destination,
        value,
        executed,
        data,
      };
      setSearchTransaction([transaction]);
    } catch (error) {
      console.error(error);
    }
  };

  const getOwners = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);

      const multiSigContract = new Contract(
        ADDRESS_MULTISIG,
        ABI_MULTISIG,
        provider
      );

      const count = await multiSigContract.getOwnersCount();
      let owners = [];
      for (let i = 0; i < Number(count); i++) {
        const owner = await multiSigContract.getOwner(i);
        owners.push(owner);
      }
      setAllOwner(owners);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLatestTransaction();
  });

  return (
    <>
      <Head>
        <title>MultiSig</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />

      <main className={styles.main}>
        <Box margin="10%">
          <Heading margin="10%" textAlign="center">
            Create your own Multisig Wallet and stay safe
          </Heading>
          <Tabs
            size="md"
            variant="enclosed"
            background="linear-gradient(45deg, #4dc5d9, #9374ffd9)"
            padding="20px"
          >
            <TabList>
              <Tab>ETH</Tab>
              <Tab>Token</Tab>
              <Tab>Change Signer</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box margin="20px">
                  <label>Address</label>
                  <Input marginBottom="30px" ref={ref} id="ethAddress" />
                  <label>Eth Amount</label>
                  <Input ref={ref1} id="ethAmount" />
                  <Flex marginTop="40px" justifyContent="space-around">
                    <Button onClick={sendTransaction}>
                      Submit Transaction
                    </Button>
                  </Flex>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box margin="20px">
                  <label>Token Address</label>
                  <Input marginBottom="30px" ref={ref2} id="tokenAddress" />
                  <label>Receiver Address</label>
                  <Input marginBottom="30px" ref={ref3} id="receiverAddress" />
                  <label>Token Amount</label>
                  <Input ref={ref4} id="tokenAmount" />
                  <Flex marginTop="40px" justifyContent="space-around">
                    <Button onClick={sendTokenTransaction}>
                      Submit Transaction
                    </Button>
                  </Flex>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box margin="20px">
                  <label>Signer Address</label>
                  <Input ref={ref5} id="changingOwner" />
                  <Flex marginTop="40px" justifyContent="space-around">
                    <Button onClick={addOwner}>Add Owner</Button>
                    <Button onClick={removeOwner}>Remove Owner</Button>
                  </Flex>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box
          margin="10%"
          background="linear-gradient(45deg, #00f9bf, #744ef7d9)"
          padding="7%"
          borderRadius="8px"
        >
          <Flex flexDir="column" justifyContent="center" padding="2% 10%">
            <Text
              fontWeight="bold"
              margin="30px"
              textAlign="center"
              fontSize="25px"
            >
              Latest Transaction
            </Text>
            <Box border="1px solid black" borderRadius="8px" padding="20px">
              <Flex justifyContent="center">
                {latestTransaction.map((transaction) => {
                  return <Transaction key={transaction.num} {...transaction} />;
                })}
              </Flex>
            </Box>
            {latestApprove == false ? (
              <Button
                margin="40px 20%"
                backgroundColor="#b8c3ff"
                onClick={approval}
              >
                Approve Transaction
              </Button>
            ) : (
              ""
            )}
          </Flex>
        </Box>
        <Box
          margin="10%"
          background="linear-gradient(45deg, #00f9bf, #744ef7d9)"
          padding="20px"
          borderRadius="8px"
        >
          <Flex flexDir="column" justifyContent="center" padding="2% 10%">
            <Text
              fontWeight="bold"
              margin="20px"
              textAlign="center"
              fontSize="25px"
            >
              Search for Transaction
            </Text>
            <Box display="flex" flexDir="column" margin=" 20px 25%">
              <Input id="transactionNumber" />
              <Button
                margin="40px 20px"
                backgroundColor="#b8c3ff"
                onClick={getSearchTransaction}
              >
                search
              </Button>
            </Box>
            <Flex
              border="1px solid black"
              borderRadius="8px"
              padding="20px"
              justifyContent="center"
            >
              {searchTransaction.map((transaction) => {
                return <Transaction key={transaction.num} {...transaction} />;
              })}
            </Flex>
            {searchApprove == false ? (
              <Button
                margin="40px 20%"
                backgroundColor="#b8c3ff"
                onClick={approvalSearch}
              >
                Approve Transaction
              </Button>
            ) : (
              ""
            )}
          </Flex>
        </Box>
        <Box
          margin="10%"
          background="linear-gradient(45deg, #00f9bf, #744ef7d9)"
          padding="20px"
          paddingTop="50px"
          borderRadius="8px"
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {allOwner.map((ownerList) => (
              <li className={styles.li}>{ownerList}</li>
            ))}
            <Button backgroundColor="#b8c3ff" margin="20px" onClick={getOwners}>
              Show Owners
            </Button>
          </Flex>
        </Box>
      </main>
      <Footer />
    </>
  );
}
