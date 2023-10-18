import React from "react";

interface VotingButtonsProps {
  onApprove: () => void;
  onAbstain: () => void;
  onReject: () => void;
  isProposalActive: boolean;
  totalVotes: any;
  votesCast: any;
  votingDuration: any;
}

const VotingButtons: React.FC<VotingButtonsProps> = ({
  onApprove,
  onAbstain,
  onReject,
  isProposalActive,
  totalVotes,
  votesCast,
  votingDuration,
}) => {
  if (!isProposalActive) {
    return null;
  }

  return (
    <div>
      <button onClick={onApprove}>Approve</button>
      <button onClick={onAbstain}>Abstain</button>
      <button onClick={onReject}>Reject</button>
      <div>Total Votes: {totalVotes}</div>
      <div>Votes Cast: {votesCast}</div>
      <div>Voting Duration: {votingDuration}</div>
    </div>
  );
};

export default VotingButtons;
