// Import the required libraries
import React from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

interface ArticleProps {
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: string | undefined;
}

const Article: React.FC<ArticleProps> = ({
  imageUrl,
  proposer,
  timestamp,
  body,
}) => {
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding={{ base: "2", md: "4" }}
      marginTop="4"
    >
      <Text as="p" size="md">
        Proposer: {formattedProposer}
      </Text>
      <Text as="p" size="md">
        Timestamp: {new Date(Number(timestamp) * 1000).toLocaleString()}
      </Text>
      <Image src={imageUrl} alt={"No Image"} mt={4} />
      {/* Use ReactMarkdown to render the markdown content */}
      <ReactMarkdown>{body || ""}</ReactMarkdown>
    </Box>
  );
};

export default Article;
