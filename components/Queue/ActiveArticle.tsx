// Import the required libraries
import React from "react";
import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

interface ArticleProps {
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: string | undefined;
  onApprove: () => void;
  onAbstain: () => void;
  onReject: () => void;
}

const ActiveArticle: React.FC<ArticleProps> = ({
  imageUrl,
  proposer,
  timestamp,
  body,
  onApprove,
  onAbstain,
  onReject,
}) => {
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  return (
    <Box marginTop="4">
      <Text as="p" size="md">
        Proposer: {formattedProposer}
      </Text>
      <Text as="p" size="md">
        Timestamp: {new Date(Number(timestamp) * 1000).toLocaleString()}
      </Text>
      <Image src={imageUrl} alt={"No Image"} mt={4} />
      {/* Use ReactMarkdown to render the markdown content */}
      {/* Use dangerouslySetInnerHTML to render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: body || "" }} />
      <div className="gap-2 md:flex">
        <Button onClick={onApprove}>Approve</Button>
        <Button onClick={onAbstain}>Abstain</Button>
        <Button onClick={onReject}>Reject</Button>
      </div>
    </Box>
  );
};

export default ActiveArticle;
