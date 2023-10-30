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
  hex: string;
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: any | undefined;
  title: string;
  teaser: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);

  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as any as MySmartContract;

  const fetchData = async () => {
    setLoading(true);
    if (!vote) {
      console.error("Vote contract is not loaded yet.");
      setLoading(false);
      return;
    }

    const proposals = await vote.getAll();

    const fetchedArticles: ArticleData[] = await Promise.all(
      proposals.map(async (proposal: any) => {
        const url = `https://gateway.irys.xyz/${proposal.description}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result) {
          return {
            hex: proposal.proposalId._hex,
            imageUrl: url,
            title: result.title,
            teaser: result.teaser,
            proposer: proposal.proposer,
            timestamp: proposal.timestamp,
            body: result.body,
          };
        } else {
          console.error("No transaction data returned from Irys");
          return null;
        }
      })
    );

    const validArticles = fetchedArticles.filter((article) => article !== null);

    setArticles(validArticles.reverse());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [vote]);

  return (
    <div className="w-full max-w-4xl ">
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
