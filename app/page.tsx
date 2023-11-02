"use client";
import { useAddress, useNetwork, ConnectWallet } from "@thirdweb-dev/react";
import { Container, Heading } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import ArticleList from "@/components/ArticleList";
import UploadForm from "@/components/UploadForm";
import MetadataList from "@/components/MetadataList";

interface Vote {
  type: number;
  label: string;
}
interface ArticleListProps {
  // Define `vote` prop to have the type of your contract
  vote: any; // Ideally, you should replace `any` with the correct contract type
}

interface Proposal {
  proposalId: any;
  description: string;
  votes: Vote[];
}

const Home = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  //console.log("👋 Address:", address);

  return (
    <>
      <Container maxWidth={1240} className="px-4 member-page">
        <Heading className="mb-8">Welcome to The Netizen</Heading>

        <MetadataList />
      </Container>
    </>
  );
};

export default Home;
