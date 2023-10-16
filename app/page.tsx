"use client";
import { useAddress, useNetwork, ConnectWallet } from "@thirdweb-dev/react";
import { Container, Heading } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import ArticleList from "@/components/ArticleList";

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

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <Container className="landing">
        <Heading>Welcome to The Netizen</Heading>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container padding={16} maxWidth={1240} className="member-page">
        <Heading>Welcome to The Netizen</Heading>
        <ArticleList />
      </Container>
    </>
  );
};

export default Home;
