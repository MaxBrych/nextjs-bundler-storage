import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import MetadataEntryComponent from "./MetadataEntry";

interface MySmartContract {
  getAll: () => Promise<any[]>;
}

interface Proposal {
  // Define the properties of a proposal object
  id: number;
  title: string;
  description: string;
  // ...
}

const MetadataList = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]); // Provide a type for the proposals state variable
  const [isLoading, setIsLoading] = useState(true);

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as any as MySmartContract;

  const fetchProposals = async () => {
    if (isVoteLoading || !vote) return;

    try {
      const data = await vote.getAll();
      setProposals(data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, [isVoteLoading, vote]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="metadata-list">
      {proposals.map((proposal, index) => (
        <MetadataEntryComponent key={index} {...proposal} />
      ))}
    </div>
  );
};

export default MetadataList;
