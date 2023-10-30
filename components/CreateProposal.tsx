import React, { useRef } from "react";
import TipTap from "./Editor/TipTap";
import { useState, ChangeEvent } from "react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Box, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { uploadMetadata } from "@/utils/uploadMetadata";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}
interface CreateProposalArticleProps {
  article?: {
    body: string;
  };
}

export default function CreateProposal() {
  const editorRef = useRef<{ getHTML: () => string } | null>(null);

  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  const [bodyValue, setBodyValue] = useState("");
  const address = useAddress();
  const [title, setTitle] = useState("");
  const [teaser, setTeaser] = useState("");

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const uploadBoth = async () => {
    if (!file) return;
    if (!editorRef.current) return;
    const markdownContent = editorRef.current.getHTML();

    if (!markdownContent) return;

    setBodyValue(markdownContent);

    const metadata = {
      title,
      teaser,
      description: markdownContent,
      image: file,
    };
    const url = await uploadMetadata(metadata); // Use uploadMetadata to upload the file

    if (url && vote) {
      await vote.propose(url); // Propose the returned URL
      window.location.reload();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      {address && (
        <>
          <FormControl marginTop="4">
            <FormLabel>Arweave Image</FormLabel>
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
            <FormControl marginTop="4">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl marginTop="4">
              <FormLabel>Teaser</FormLabel>
              <Input
                type="text"
                placeholder="Enter teaser"
                value={teaser}
                onChange={(e) => setTeaser(e.target.value)}
              />
            </FormControl>
            <div>
              <TipTap ref={editorRef} />
            </div>
          </FormControl>
          <Button
            colorScheme="blue"
            marginTop="4"
            disabled={isVoteLoading}
            isLoading={isVoteLoading}
            onClick={uploadBoth}
          >
            Create Proposal and Article
          </Button>
        </>
      )}
    </Box>
  );
}
