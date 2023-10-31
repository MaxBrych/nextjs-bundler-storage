"use client";

import { Container, Heading } from "@chakra-ui/react";
import {
  ConnectWallet,
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useMetadata,
  useNFTBalance,
} from "@thirdweb-dev/react";
import React, { useEffect, useMemo, useState } from "react";

import { Box } from "@chakra-ui/react";
interface Vote {
  type: number;
  label: string;
}
interface Proposal {
  proposalId: any;
  description: string;
  votes: Vote[];
}

export default function CreateArticle() {
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

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <Container className="landing">
        <h1>Welcome to The Netizen</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </Container>
    );
  }
  // Render the screen where the user can claim their NFT.
  // If the user has already claimed their NFT we want to display the internal DAO page to them
  // only DAO members will see this. Render all the members + token amounts.
  if (hasClaimedNFT) {
    return (
      <>
        <Box p="6" bgColor="white" textColor={"blackAlpha.900"}></Box>
      </>
    );
  }
  return (
    <Container className="mint-nft">
      <Heading>Mint your free 🍪DAO Membership NFT</Heading>
      <MediaRenderer src={(metadata as { image: string })?.image} />
      <p>
        balance: {nftBalance?.toString()} <br />
      </p>
      <br />
      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          action={(contract) => {
            contract?.erc1155.claim(0, 1);
          }}
          onSuccess={() => {
            console.log(
              `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop?.getAddress()}/0`
            );
          }}
          onError={(error) => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </Container>
  );
}
