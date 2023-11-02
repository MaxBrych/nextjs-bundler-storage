import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import MetadataEntryComponent from "./MetadataEntry";
import { queryMetadata, MetadataEntry } from "../utils/queryMetadata";

interface MySmartContract {
  getAll: () => Promise<any[]>;
}

interface Proposal extends MetadataEntry {
  title: string;
}

const MetadataList = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as any as MySmartContract;

  const fetchProposals = async (): Promise<void> => {
    if (isVoteLoading || !vote) return;

    try {
      const data = await vote.getAll();
      const metadataPromises = data.map((proposal: Proposal) => {
        return queryMetadata(proposal.description);
      });
      const metadataEntries = await Promise.all(metadataPromises);
      const updatedProposals = data.map((proposal: Proposal, index: number) => {
        return {
          ...proposal,
          ...metadataEntries[index], // Merge the fetched metadata with the proposal
        };
      });
      setProposals(updatedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Failed to load proposals. Please try again later.");
    }
    console.log("proposals", proposals);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, [isVoteLoading, vote, setProposals, setIsLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const sortedProposals = [...proposals].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className="flex flex-col max-w-4xl gap-4 md:gap-2 md:grid md:grid-cols-3">
      {sortedProposals.map((proposal, index) => (
        <MetadataEntryComponent key={index} {...proposal} />
      ))}
    </div>
  );
};

export default MetadataList;
