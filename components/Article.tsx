import React, { useMemo, useState } from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Editable, withReact, Slate } from "slate-react";
import { createEditor } from "slate";

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

  let initialBodyValue;
  try {
    // Attempt to parse the body prop. If it's undefined or not valid JSON,
    // this will throw an error, and we'll catch it and set a default value instead.
    initialBodyValue = JSON.parse(body || "");
  } catch {
    // If we couldn't parse the body prop, fall back to a default value
    initialBodyValue = [{ type: "paragraph", children: [{ text: "" }] }];
  }

  // Initialize the Slate editor
  const editor = useMemo(() => withReact(createEditor()), []);
  const [bodyValue, setBodyValue] = useState(initialBodyValue);

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
      <Text as="p" size="md">
        {body}
      </Text>
      <Slate editor={editor} initialValue={bodyValue}>
        <Editable readOnly />
      </Slate>
    </Box>
  );
};

export default Article;
