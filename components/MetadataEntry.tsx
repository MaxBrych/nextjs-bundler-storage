import React, { useEffect, useState } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { VoteType } from "@thirdweb-dev/sdk";
import Image from "next/image";
import Link from "next/link";

interface MySmartContract {
  hasVoted: (proposalId: string, address: string) => Promise<boolean>;
  getProposalVotes: (proposalId: string) => Promise<any>;
  vote: (proposalId: string, voteType: VoteType) => Promise<void>;
}

function formatDate(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
    castVote(VoteType.For);
    getProposalData(); // Update the votes count after casting vote
  };

  const voteAgainst = async () => {
    castVote(VoteType.Against);
    getProposalData(); // Update the votes count after casting vote
  };

  const voteAbstain = async () => {
    castVote(VoteType.Abstain);
    getProposalData(); // Update the votes count after casting vote
  };

  const castVote = async (voteType: VoteType) => {
    await vote.vote(id, voteType);
    window.location.reload();
  };

  let url: string | undefined;
  if (image && image.startsWith("data:")) {
    url = image; // The image field now contains a data URL directly
  }

  return (
    <div className="flex flex-col">
      <Link href={`/article/${id}`} className="flex flex-col" key={id}>
        <Image
          width={320}
          height={320}
          src={url ?? ""}
          alt={name}
          className="object-cover object-center w-full rounded-lg max-h-56"
        />
        <p className="text-xs opacity-80">{formatDate(timestamp)}</p>
        <p className="text-lg font-medium ">{name}</p>
        <p className="text-sm opacity-80">{description}</p>

        <p className="text-xs opacity-80">{address}</p>
      </Link>
      <div className="flex gap-2">
        <button
          className="flex justify-center px-4 py-2 text-sm text-black rounded-md cursor-pointer bg-zinc-100"
          disabled={hasVoted}
          onClick={voteFor}
        >
          For {votes.for}
        </button>
        <button
          className="flex justify-center px-4 py-2 text-sm text-black rounded-md cursor-pointer bg-zinc-100"
          disabled={hasVoted}
          onClick={voteAgainst}
        >
          Against {votes.against}
        </button>
        <button
          className="flex justify-center px-4 py-2 text-sm text-black rounded-md cursor-pointer bg-zinc-100"
          disabled={hasVoted}
          onClick={voteAbstain}
        >
          Abstain {votes.abstain}
        </button>
      </div>
    </div>
  );
}
