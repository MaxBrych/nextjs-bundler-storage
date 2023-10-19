"use client";
import {
  Card,
  Heading,
  SimpleGrid,
  Table,
  TableCaption,
  Center,
  Text,
} from "@chakra-ui/react";
import {
  useAddress,
  useNetwork,
  ConnectWallet,
  useMetadata,
  Web3Button,
  useContract,
  useNFTBalance,
  MediaRenderer,
  ChainId,
} from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";
import { AddressZero } from "@ethersproject/constants";

export default function Dashboard() {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  //console.log("👋 Address:", address);

  // Initialize our Edition Drop contract
  const editionDropAddress = "0x7f2BfBf0E6904b5B6Facec197C64b8eB4b1aBeC1";
  const { contract: editionDrop } = useContract(
    editionDropAddress,
    "edition-drop"
  );
  const { contract: vote } = useContract(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS,
    "vote"
  );
  if (vote === undefined) {
    console.log("vote is undefined");
  }

  const { contract: token } = useContract(
    "0x3Aa1FebD87D6Cf9bAB16475f943b39DbFbf18f33",
    "token"
  );

  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0");
  const { data: metadata, isLoading: isLoadingMetadata } =
    useMetadata(editionDrop);

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  //array of addresses
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);

  //function to shorten someones wallet address
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  useEffect(() => {
    const getMembers = async () => {
      try {
        if (editionDrop?.history?.getAllClaimerAddresses) {
          const memberAddress =
            await editionDrop.history.getAllClaimerAddresses(0);
          if (memberAddress) {
            setMemberAddresses(memberAddress);
            console.log("Members:", memberAddress);
          }
        } else {
          console.log(
            "getAllClaimerAddresses method is not available on editionDrop contract"
          );
        }
      } catch (error) {
        console.error("Failed to get members", error);
      }
    };
    getMembers();
  }, [hasClaimedNFT, editionDrop?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: 1,
      };
    });
  }, [memberAddresses]);

  return (
    <>
      <Center>
        <Heading>DAO Dashboard</Heading>
      </Center>
      <Center paddingBottom={8}>
        <Text>Congratulations on being a member!</Text>
      </Center>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Card borderRadius={20} padding={6}>
          <Heading fontSize={20}>Member List</Heading>
          <Table className="card">
            <TableCaption>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </TableCaption>
            <TableCaption>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </TableCaption>
          </Table>
        </Card>
      </SimpleGrid>
    </>
  );
}
