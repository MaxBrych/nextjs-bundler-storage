import React from "react";
import { Box, Heading, Image } from "@chakra-ui/react";

interface ArticleProps {
  title: string;
  imageUrl: string;
}

const Article: React.FC<ArticleProps> = ({ title, imageUrl }) => (
  <Box borderWidth="1px" borderRadius="lg" padding="4" marginTop="4">
    <Heading as="h2" size="lg">
      {title}
    </Heading>
    <Image src={imageUrl} alt={title} mt={4} />
  </Box>
);

export default Article;
