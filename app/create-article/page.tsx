"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import CreateArticleProposal from "../../components/CreateArticleProposal";

export default function CreateArticle() {
  return (
    <Box p="6" bgColor="white">
      <CreateArticleProposal />
    </Box>
  );
}
