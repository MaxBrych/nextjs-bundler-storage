// components/ProposalData.tsx

import React, { useEffect, useState } from "react";
import { queryMetadata, MetadataEntry } from "../utils/queryMetadata";

interface ProposalDataProps {
  proposalId: string;
}

function ProposalData({ proposalId }: ProposalDataProps) {
  const [proposal, setProposal] = useState<MetadataEntry | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      const metadata = await queryMetadata(proposalId);
      setProposal(metadata || null); // provide a default value of null
    };
    fetchProposal();
  }, [proposalId]);

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render proposal details here */}
      <h1>{proposal.name}</h1>
      <p>{proposal.description}</p>
      {/* ...other proposal details */}
    </div>
  );
}

export default ProposalData;
