import React from "react";
import TipTap from "./Editor/TipTap";
import { useState, ChangeEvent } from "react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Box, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";

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
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  const [bodyValue, setBodyValue] = useState("");
  const address = useAddress();

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const uploadBoth = async () => {
    if (!file || !bodyValue) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", JSON.stringify(bodyValue));

    try {
      const response = await fetch("/api/uploadBoth", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);

      if (vote) {
        await vote.propose(json.txId);
        window.location.reload();
      }
    } catch (err) {
      console.log({ err });
    }

    try {
      JSON.parse(bodyValue);
    } catch (e) {
      console.error("Invalid JSON:", bodyValue);
      return;
    }

    console.log("Body Value to upload:", bodyValue);
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
          <TipTap
            onContentChange={(content: any) =>
              setBodyValue(JSON.stringify(content))
            }
          />
          <FormControl marginTop="4">
            <FormLabel>Arweave File</FormLabel>
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
