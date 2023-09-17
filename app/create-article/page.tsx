"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import CreateProposal from "@/components/CreateProposal";

export default function CreateArticle() {
  return (
    <Box p="6" bgColor="white" textColor={"blackAlpha.900"}>
      <CreateProposal />
    </Box>
  );
}
