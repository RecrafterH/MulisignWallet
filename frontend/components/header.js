import styles from "@/styles/Home.module.css";
import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { useState } from "react";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletConnected(true);
    console.log(address);
  };

  return (
    <header className={styles.header}>
      <Box
        padding="30px"
        background="linear-gradient(45deg, #d46dc9, #744ef7d9)"
        color="white"
        display="flex"
        justifyContent="space-between"
      >
        <Heading>Multi Secure</Heading>
        <Box>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              background="white"
              color="black"
            >
              Open menu
            </MenuButton>
            <MenuList>
              <MenuItem color="black">PlaceHolder</MenuItem>
            </MenuList>
          </Menu>
          {walletConnected ? (
            <Button color="black" marginLeft="20px">
              Connected
            </Button>
          ) : (
            <Button color="black" marginLeft="20px" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>
    </header>
  );
};

export default Header;
