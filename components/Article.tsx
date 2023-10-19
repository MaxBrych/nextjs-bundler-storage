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

const Article: React.FC<ArticleProps> = ({
  imageUrl,
  proposer,
  timestamp,
  body,
  title,
  teaser,
}) => {
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;

  return (
    <Box marginTop="4">
      <Image src={imageUrl} alt={"No Image"} mt={4} />
      <Heading as="h2" size="xl">
        {title || ""}
      </Heading>
      <Text as="p" size="md">
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

export default Article;
