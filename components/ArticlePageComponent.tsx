// Import the required libraries
import React from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

interface ArticleProps {
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: string | undefined;
  title: string;
  teaser: string;
}

const ArticlePageComponent: React.FC<ArticleProps> = ({
  imageUrl,
  title,
  teaser,
  proposer,
  timestamp,
  body,
}) => {
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  return (
    <Box marginTop="4">
      <Image src={imageUrl} alt={"No Image"} mt={4} />
      <Heading as="h2" size="2xl">
        {title || ""}
      </Heading>
      <Text as="p" size="lg">
        {teaser || ""}
      </Text>
      <Text as="p" size="md">
        Proposer: {formattedProposer}
      </Text>
      <Text as="p" size="md">
        Timestamp: {new Date(Number(timestamp) * 1000).toLocaleString()}
      </Text>
      {/* Use ReactMarkdown to render the markdown content */}
      {/* Use dangerouslySetInnerHTML to render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: body || "" }} />
    </Box>
  );
};

export default ArticlePageComponent;
