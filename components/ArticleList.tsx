import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Article from "./Article";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}

interface ArticleData {
  id: string;
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: any | undefined;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!vote) {
        console.error("Vote contract is not loaded yet :/");
        return;
      }

      const proposals = await vote.getAll();

      const fetchedArticles: ArticleData[] = await Promise.all(
        proposals.map(async (proposal: any) => {
          // Extract the unique identifier from proposal
          const id = proposal[0].hex;

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
              console.log("Body Content retrieved:", bodyContent);

              return {
                id,
                imageUrl: proposal.description,
                proposer: proposal.proposer,
                timestamp: proposal.timestamp,
                body,
              };
            } else {
              return null;
            }
          }
        })
      );

      const validArticles = fetchedArticles.filter(
        (article) => article !== null
      );

      setArticles(validArticles.reverse());
      setIsLoading(false);
    };

    fetchData();
  }, [vote]);

  return (
    <div>
      {isLoading ? (
        <Skeleton count={5} />
      ) : (
        articles.map((article) => (
          <div
            key={article.id}
            onClick={() => router.push(`/article/${article.id}`)}
          >
            <Article
              imageUrl={article.imageUrl}
              proposer={article.proposer}
              timestamp={article.timestamp}
              body={undefined}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ArticleList;
