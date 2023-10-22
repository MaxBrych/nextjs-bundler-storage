"use client";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import {
  Web3Button,
  useContract,
  useAddress,
  useNFT,
  useOwnedNFTs,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { NFT_ADDRESS } from "../../../constants/addresses";
import { useRouter } from "next/navigation";

import React from "react";

export default function ProfilePage() {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(NFT_ADDRESS);

  const { data: ownedNFTs, isLoading: loadingOwnedNFTs } = useOwnedNFTs(
    contract,
    address
  );

  const [transferAddress, setTransferAddress] = React.useState("");

  const toas = useToast();
  return (
    <Container>
      <Button onClick={() => router.push("/")}>Back</Button>
      <Heading mt={10}>Profile</Heading>
      <Box mt={10}>
        <Text fontWeight={"bold"}>My Membership:</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} my={4}>
          {!loadingOwnedNFTs &&
            ownedNFTs?.map((nft) => (
              <Card overflow="hidden" p={2} key={nft.metadata.id}>
                <MediaRenderer
                  src={nft.metadata.image}
                  height="100%"
                  width="100%"
                />
                <Flex>
                  <Text ml={4}>{nft.metadata.name}</Text>
                  <Text mr={4}>Qty:{nft.quantityOwned}</Text>
                </Flex>
                <Text fontSize="x-small" ml={4}>
                  Transfer to:
                </Text>
                <Input
                  placeholder="0x..."
                  width="90%"
                  mx="auto"
                  mb={4}
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                />
                {transferAddress !== "" && (
                  <Box>
                    <Web3Button
                      contractAddress={NFT_ADDRESS}
                      action={(contract) =>
                        contract.erc1155.transfer(
                          nft.metadata.id,
                          transferAddress,
                          nft.metadata.id // Use a different property as the identifier
                        )
                      }
                      onSubmit={() => setTransferAddress("")}
                      onSuccess={() =>
                        toas({
                          title: "Transfer Successful",
                          description: "Your NFT has been transferred",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        })
                      }
                    />
                  </Box>
                )}
              </Card>
            ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
