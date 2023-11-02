"use client";
import { useParams } from "next/navigation";
import ProposalData from "../../../components/ArticleDetails";

function ProposalPage() {
  let params = useParams();

  const { id } = params; // Get the proposal ID from the URL

  if (!id) {
    return <div>Loading...</div>;
  }

  return <ProposalData proposalId={id as string} />;
}

export default ProposalPage;
