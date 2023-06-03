// components/renderFunctions.tsx

import React from "react";
import { Text } from "@chakra-ui/react";
import { RenderElementProps, RenderLeafProps } from "slate-react";

export const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <Text as="b">{children}</Text>;
  }

  if (leaf.italic) {
    children = <Text as="i">{children}</Text>;
  }

  if (leaf.underline) {
    children = <Text textDecoration="underline">{children}</Text>;
  }

  return <span {...attributes}>{children}</span>;
};
