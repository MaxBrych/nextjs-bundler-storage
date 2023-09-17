import React, { ChangeEvent, useState } from "react";
import { Box, Input, Button, FormControl, FormLabel } from "@chakra-ui/react";
import { Editor } from "novel";

import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}
interface CreateProposalArticleProps {
  article?: {
    body: string;
  };
}

export default function CreateProposalArticle({
  article,
}: CreateProposalArticleProps) {
  const address = useAddress();
  const [category, setCategory] = useState("");
  const [headline, setHeadline] = useState("");
  const [teaser, setTeaser] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");

  // New state variable for the editor content
  const [bodyValue, setBodyValue] = useState("");

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const uploadBoth = async () => {
    if (!file || !category || !headline || !teaser) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("headline", headline);
    formData.append("teaser", teaser);
    //formData.append("body", JSON.stringify(bodyValue));

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

  const handleEditorUpdate = (editor?: any) => {
    if (editor) {
      setBodyValue(editor.getJSON()); // or editor.getHTML() or editor.getText() based on the API of the Editor component
    }
    //console.log(editor.getJSON());
  };
  const defaultEditorContent = "<p>Start writing...</p>"; // or whatever your default content should be

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      {address && (
        <>
          <FormControl marginTop="4">
            <FormLabel>Category</FormLabel>
            <Input
              placeholder="Enter category"
              onChange={(e) => setCategory(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Headline</FormLabel>
            <Input
              placeholder="Enter headline"
              onChange={(e) => setHeadline(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Teaser</FormLabel>
            <Input
              placeholder="Enter teaser"
              onChange={(e) => setTeaser(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
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
          <FormControl marginTop="4">
            <Editor defaultValue={article?.body || defaultEditorContent} />
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
