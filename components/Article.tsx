import React, { useMemo, useState } from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Editor } from "novel";

interface ArticleProps {
  category: string;
  headline: string;
  teaser: string;
  imageUrl: string;
  proposer: string;
  timestamp: string;
  body: string | undefined;
}

const Article: React.FC<ArticleProps> = ({
  category,
  headline,
  teaser,
  imageUrl,
  proposer,
  timestamp,
  body,
}) => {
  const formattedProposer = `${proposer.slice(0, 6)}...${proposer.slice(-4)}`;
  // Convert body (string) to a format suitable for the Novel Editor
  const formattedBody = useMemo(() => {
    return {
      document: {
        nodes: [
          {
            object: "block",
            type: "paragraph",
            nodes: [
              {
                object: "text",
                leaves: [{ text: body || "" }],
              },
            ],
          },
        ],
      },
    };
  }, [body]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      padding={{ base: "2", md: "4" }}
      marginTop="4"
    >
      <Heading as="h5" size="md">
        {category}
      </Heading>
      <Heading as="h2" size="lg">
        {headline}
      </Heading>
      <Heading as="h4" size="md">
        {teaser}
      </Heading>
      <Text as="p" size="md">
        Proposer: {formattedProposer}
      </Text>
      <Text as="p" size="md">
        Timestamp: {new Date(Number(timestamp) * 1000).toLocaleString()}
      </Text>
      <Image src={imageUrl} alt={headline} mt={4} />
      <Editor
        defaultValue={formattedBody}
        editorProps={{ editable: () => false }}
      />
    </Box>
  );
};

export default Article;
