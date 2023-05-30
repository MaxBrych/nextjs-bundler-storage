import React from "react";
import { Box, Heading, Image } from "@chakra-ui/react";

interface ArticleProps {
  category: string;
  headline: string;
  teaser: string;
  imageUrl: string;
}

const Article: React.FC<ArticleProps> = ({
  category,
  headline,
  teaser,
  imageUrl,
}) => (
  <Box borderWidth="1px" borderRadius="lg" padding="4" marginTop="4">
    <Heading as="h5" size="md">
      {category}
    </Heading>
    <Heading as="h2" size="lg">
      {headline}
    </Heading>
    <Heading as="h4" size="md">
      {teaser}
    </Heading>
    <Image src={imageUrl} alt={headline} mt={4} />
  </Box>
);

export default Article;
