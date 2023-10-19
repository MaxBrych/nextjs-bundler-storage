import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Article from "./Article";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}

interface ArticleData {
  hex: string; // Add a hex field to ArticleData
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: any | undefined;
  title: string;
  teaser: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true at the start of fetchData
      if (!vote) {
        console.error("Vote contract is not loaded yet");
        setLoading(false); // Set loading to false if vote contract isn't loaded
        return;
      }

      const proposals = await vote.getAll();

      const fetchedArticles: ArticleData[] = await Promise.all(
        proposals.map(async (proposal: any) => {
          // extract the hex value from the first item of each proposal array
          const hex = proposal[0]?.hex;
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
              let title = tags.find((tag: any) => tag.name === "Title")?.value;
              let teaser = tags.find(
                (tag: any) => tag.name === "Teaser"
              )?.value;
              let bodyContent = tags.find(
                (tag: any) => tag.name === "Body"
              )?.value;
              const body =
                bodyContent && bodyContent.startsWith("{")
                  ? JSON.parse(bodyContent)
                  : bodyContent
                  ? bodyContent
                  : null;

              return {
                hex: proposal.proposalId._hex,
                imageUrl: proposal.description,
                title,
                teaser,
                proposer: proposal.proposer,
                timestamp: proposal.timestamp,
                body,
              };
            } else {
              console.error("No transaction data returned from Arweave");
              return null;
            }
          } else {
            return null;
          }
        })
      );

      const validArticles = fetchedArticles.filter(
        (article) => article !== null
      );

      setArticles(validArticles.reverse()); // Reverse the order of articles
      setLoading(false); // Set loading to false after articles have been set
    };

    fetchData();
  }, [vote]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div> // Display a loading message or skeleton loader here
      ) : (
        articles.map((article, index) => (
          <Link href={`/article/${article.hex}`} key={index}>
            {" "}
            {/* Use Link component to route to individual article pages */}{" "}
            {/* Wrap the Article component with an anchor tag */}
            <Article
              imageUrl={article.imageUrl}
              title={article.title || ""}
              teaser={article.teaser || ""}
              proposer={article.proposer}
              timestamp={article.timestamp}
              body={undefined}
            />
          </Link>
        ))
      )}
    </div>
  );
};

export default ArticleList;
