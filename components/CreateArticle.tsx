"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Button,
  Textarea,
  Box,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Link,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (description: string) => Promise<void>;
}

export default function CreateArticleAndProposal() {
  const address = useAddress();
  const [proposalDescription, setProposalDescription] = useState("");
  const [file, setFile] = useState<any>();
  const [category, setCategory] = useState("");
  const [headline, setHeadline] = useState("");
  const [teaser, setTeaser] = useState("");
  const [transaction, setTransaction] = useState("");

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as any;

  const createProposal = async (proposalDescription: string) => {
    if (!vote) return;
    await vote.propose(proposalDescription);
    window.location.reload();
  };

  const uploadBoth = async () => {
    if (!file || !category || !headline || !teaser) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("headline", headline);
    formData.append("teaser", teaser);
    try {
      const response = await fetch("/api/uploadBoth", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      const jsonString = JSON.stringify(json);
      setProposalDescription(jsonString);
      await vote.propose(proposalDescription);
    } catch (err) {
      console.log({ err });
    }
  };

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      <VStack spacing={4} align="flex-start" h="full" py={12} px={4} maxW="2xl">
        <Input
          placeholder="Enter category"
          onChange={(e) => setCategory(e.target.value)}
          bg="gray.700"
          textColor="white"
          borderRadius="xl"
        />
        <Input
          placeholder="Enter headline"
          onChange={(e) => setHeadline(e.target.value)}
          bg="gray.700"
          textColor="white"
          borderRadius="xl"
        />
        <Input
          placeholder="Enter teaser"
          onChange={(e) => setTeaser(e.target.value)}
          bg="gray.700"
          textColor="white"
          borderRadius="xl"
        />
        <Input
          type="file"
          placeholder="Upload a file"
          onChange={handleFileChange}
          cursor="pointer"
          border="2px dashed"
          height={24}
          borderColor="gray.700"
          borderRadius="xl"
        />
        <Button
          onClick={uploadBoth}
          color="white"
          bg="black"
          rounded="full"
          size="lg"
          disabled={isVoteLoading}
          isLoading={isVoteLoading}
        >
          Upload All & Create Proposal
        </Button>
        {transaction && (
          <Link
            target="_blank"
            rel="noopener"
            href={transaction}
            color="black"
            borderColor="black"
            bg="white"
            p={4}
            borderRadius="full"
            textAlign="center"
          >
            View Arweave Data
          </Link>
        )}
      </VStack>
    </Box>
  );
}
