import React from "react";
import TipTap from "./Editor/TipTap";
import { serializeTipTapToMarkdown } from "./serializer";
import { useState, ChangeEvent } from "react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Box, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import NSFWFilter from "nsfw-filter";

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
  const [isImageSafe, setIsImageSafe] = useState(true); // New state to manage whether the image is safe or not

  const address = useAddress();

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const uploadBoth = async () => {
    if (!file || !bodyValue) return;

    const formData = new FormData();
    formData.append("file", file);

    // Assuming bodyValue is already a stringified JSON in the correct format
    formData.append("message", bodyValue);

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

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.target.files) {
      const file = event.target.files[0];
      // Check if the image is safe
      const isSafe = await NSFWFilter.isSafe(file);
      setIsImageSafe(isSafe); // Update the isImageSafe state

      if (isSafe) {
        // Only set the file if it is safe
        setFile(file);
      } else {
        // Optionally, you can clear the file input here or show a warning message to the user.
        console.warn("Uploaded image is not safe");
      }
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      {address && (
        <>
          <TipTap
            onContentChange={(content: any) => {
              const markdown = serializeTipTapToMarkdown(content);
              setBodyValue(markdown);
            }}
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
            disabled={isVoteLoading || !isImageSafe} // Disable the button if the image is not safe
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
