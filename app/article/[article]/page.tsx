"use client";
import { Container } from "@chakra-ui/react";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useMetadata,
  useNFTBalance,
} from "@thirdweb-dev/react";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import ArticlePageComponent from "../../../components/ArticlePageComponent";

interface ArticleData {
  hex: string;
  imageUrl: any;
  proposer: string;
  timestamp: string;
  body: any;
}

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
}

const ArticlePage: React.FC = () => {
  const params = useParams(); // Get the hex value from the URL
  const hex = params.article;
  console.log("Hex from URL:", hex);

  const [article, setArticle] = useState<ArticleData | null>(null);
  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );
  const vote = voteContract as unknown as MySmartContract;

  useEffect(() => {
    const fetchData = async () => {
      if (!vote) {
        console.error("Vote contract is not loaded yet");
        return;
      }
      try {
        const allProposals = await vote.getAll();
        // Correctly use proposal.proposalId._hex to find the right proposal
        const proposal = allProposals.find(
          (p: any) => p.proposalId._hex === hex
        );
        if (proposal) {
          if (proposal.description.startsWith("https://arweave.net/")) {
            const transactionId = proposal.description.split("/").pop();
            // GraphQL query
            const query = `
          query getByIds {
            transactions(ids:["${transactionId}"]) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }`;

            // Make a POST request to the GraphQL endpoint
            const response = await fetch("https://arweave.net/graphql", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: query,
              }),
            });

            const result = await response.json();

            // Get the metadata from the tags
            if (result.data.transactions.edges[0]) {
              const tags = result.data.transactions.edges[0].node.tags;

              let bodyContent = tags.find(
                (tag: any) => tag.name === "Body"
              )?.value;
              const body =
                bodyContent && bodyContent.startsWith("{")
                  ? JSON.parse(bodyContent)
                  : bodyContent
                  ? bodyContent
                  : null;
              //console.log("Body Content retrieved:", bodyContent);
              console.log("Proposal retrieved:", proposal);

              const articleData = {
                hex: proposal.proposalId._hex,
                imageUrl: proposal.description,
                proposer: proposal.proposer,
                timestamp: proposal.timestamp,
                body,
              };
              setArticle(articleData);
            } else {
              console.error("No proposal found with the given hex:", hex);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchData();
  }, [hex, vote]);

  return (
    <div>
      {article ? (
        <ArticlePageComponent
          imageUrl={article.imageUrl}
          proposer={article.proposer}
          timestamp={article.timestamp}
          body={article.body}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ArticlePage;
