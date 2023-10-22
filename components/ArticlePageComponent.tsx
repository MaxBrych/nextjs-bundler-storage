// Import the required libraries
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
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
    <Box marginTop="6">
      <Heading as="h2" size="2xl">
        {title || ""}
      </Heading>
      <Text as="p" size="lg">
        {teaser || ""}
      </Text>
      <Image
        src={imageUrl}
        alt={"No Image"}
        className="w-full rounded-lg md:max-h-[520px] max-h-64"
        width={560}
        height={320}
      />
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
