import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import Article from "./Article";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}

interface ArticleData {
  title: string;
  imageUrl: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);

  const { contract: voteContract } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  useEffect(() => {
    const fetchData = async () => {
      // Get all proposals from the contract
      const proposals = await vote.getAll();

      // Filter out the proposals that have an Arweave URL as the description
      const arweaveProposals = proposals.filter((proposal: any) =>
        proposal.description.startsWith("https://arweave.net/")
      );

      // Prepare the article data for each Arweave URL
      const fetchedArticles: ArticleData[] = arweaveProposals.map(
        (proposal: { title: any; description: any }) => ({
          title: proposal.title, // In this example, we're assuming the title of the article is the proposal's title.
          imageUrl: proposal.description,
        })
      );

      setArticles(fetchedArticles);
    };

    fetchData();
  }, [vote]);

  return (
    <div>
      {articles.map((article, index) => (
        <Article
          key={index}
          title={article.title}
          imageUrl={article.imageUrl}
        />
      ))}
    </div>
  );
};

export default ArticleList;
