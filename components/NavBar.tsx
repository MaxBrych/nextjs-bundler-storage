import {
  Avatar,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";

import {
  ConnectWallet,
  useAddress,
  useDisconnect,
  useNetworkMismatch,
  useSwitchChain,
  useChainId,
} from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import { ConnectedWalletDetails } from "@thirdweb-dev/react/dist/declarations/src/wallet/ConnectWallet/Details";
import { Wallet } from "ethers";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { HiMenuAlt4 } from "react-icons/hi";
import Logo from "./ui/Logo";

export default function Navbar() {
  const address = useAddress();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const chainId = useChainId();

  const router = useRouter();

  const handleProfileRedirect = () => {
    if (address) {
      router.push(`/profile/${address}`);
    }
  };

  return (
    <Container maxW={"1200px"} py={5}>
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
        <Link href="/">
          <Logo />
        </Link>
        {!address ? (
          <ConnectWallet btnTitle="Sign In" theme="light" />
        ) : isMismatched ? (
          <button
            className="px-4 text-sm font-semibold bg-white rounded-full h-9"
            onClick={() => switchChain(Mumbai.chainId)}
          >
            Switch Network
          </button>
        ) : (
          <Menu>
            <MenuButton
              rounded={"full"}
              bg={"white"}
              pr={2}
              py={2}
              pl={2}
              className="flex bg-white border border-gray-200 rounded-full "
            >
              <Image
                src={
                  "https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png"
                }
                alt="Avatar"
                height={36}
                width={36}
                className="border border-gray-300 rounded-full"
              />
            </MenuButton>

            <MenuList>
              <MenuItem>
                <Link href="/">Home</Link>
              </MenuItem>
              <MenuItem onClick={handleProfileRedirect}>Profile</MenuItem>
              <MenuItem>
                <Link href="/dashboard">Dashboard</Link>
              </MenuItem>
              <MenuItem>
                <Link href="/create-article">Create Article</Link>
              </MenuItem>
              <MenuItem>
                <Link href="/queue">Queue</Link>
              </MenuItem>

              <MenuItem>
                <Button
                  colorScheme="grey"
                  textColor={"black"}
                  onClick={disconnect}
                >
                  Sign Out
                </Button>
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Container>
  );
}
