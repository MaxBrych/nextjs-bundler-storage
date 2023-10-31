import React, { useEffect, useState } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { VoteType } from "@thirdweb-dev/sdk";

interface MySmartContract {
  hasVoted: (proposalId: string, address: string) => Promise<boolean>;
  getProposalVotes: (proposalId: string) => Promise<any>;
  vote: (proposalId: string, voteType: VoteType) => Promise<void>;
}

export default function MetadataEntry({
  id,
  name,
  description,
  timestamp,
  address,
  image,
}: any) {
  const userAddress = useAddress();
  const [votes, setVotes] = useState({ for: 0, against: 0, abstain: 0 });
  const [hasVoted, setHasVoted] = useState(true);

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as any as MySmartContract;

  const getProposalData = async () => {
    if (isVoteLoading || !vote) return;

    try {
      const voted = await vote.hasVoted(id, userAddress || "");
      setHasVoted(voted);
      const votesData = await vote.getProposalVotes(id);
      setVotes({
        against: parseFloat(ethers.utils.formatEther(votesData[0].count)),
        for: parseFloat(ethers.utils.formatEther(votesData[1].count)),
        abstain: parseFloat(ethers.utils.formatEther(votesData[2].count)),
      });
    } catch (error) {
      console.error("Error fetching proposal data:", error);
    }
  };

  useEffect(() => {
    getProposalData();
  }, [isVoteLoading]);

  const voteFor = async () => {
    await vote.vote(id, VoteType.For);
    getProposalData(); // Update the votes count after casting vote
  };

  const voteAgainst = async () => {
    await vote.vote(id, VoteType.Against);
    getProposalData(); // Update the votes count after casting vote
  };

  const voteAbstain = async () => {
    await vote.vote(id, VoteType.Abstain);
    getProposalData(); // Update the votes count after casting vote
  };

  const blob = new Blob([new Uint8Array(image.data)], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);

  return (
    <div className="metadata-entry">
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <p>Timestamp: {timestamp}</p>
      <p>Address: {address}</p>
      <img src={url} alt={name} /> {/* Fixed src attribute to use url */}
      <button disabled={hasVoted} onClick={voteFor}>
        For {votes.for}
      </button>
      <button disabled={hasVoted} onClick={voteAgainst}>
        Against {votes.against}
      </button>
      <button disabled={hasVoted} onClick={voteAbstain}>
        Abstain {votes.abstain}
      </button>
    </div>
  );
}
