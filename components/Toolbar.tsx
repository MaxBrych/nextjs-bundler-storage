import { CustomEditor } from "@/constants/costum-types";
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiHeading,
  BiListUl,
} from "react-icons/bi";
import { FaQuoteLeft } from "react-icons/fa";
import { RiListOrdered } from "react-icons/ri";
import { useSlate } from "slate-react";

import { Editor, Transforms, Element, NodeEntry, Text } from "slate";
import { CustomElement } from "@/constants/costum-types";

type ToolbarButton = (typeof toolbarButtons)[number];

//...

const toolbarButtons = [
  { format: "bold", label: "Bold", icon: BiBold },
  { format: "italic", label: "Italic", icon: BiItalic },
  { format: "underline", label: "Underline", icon: BiUnderline },
  { format: "heading-two", label: "H2", icon: BiHeading },
  { format: "heading-three", label: "H3", icon: BiHeading },
  { format: "blockquote", label: "Quote", icon: FaQuoteLeft },
  { format: "numbered-list", label: "Numbered List", icon: RiListOrdered },
  { format: "bulleted-list", label: "Bulleted List", icon: BiListUl },
] as const;

const Toolbar = () => {
  const editor = useSlate();

  const match: NodeEntry<CustomElement>[] = Array.from(
    Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "paragraph",
    })
  );

  match.forEach(([node, path]) => {
    if ("type" in node && node.type === "paragraph") {
      console.log(node.children);
    }
  });

  {
    /*   
  const toggleFormat = (editor: Editor, format: any) => {
    const isBlock = [
      "heading-two",
      "heading-three",
      "blockquote",
      "bulleted-list",
      "numbered-list",
    ].includes(format);

    if (isBlock) {
      const isActive = isBlockActive(editor, format);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : format },
        { match: (n: any) => Editor.isBlock(editor, n) }
      );
    } else {
      const isActive = isFormatActive(editor, format);
      Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: (n: any) => Editor.isText(editor, n), split: true }
      );
    }
  };
  const isBlockActive = (editor: Editor, format: string) => {
    const match: any = Array.from(
      Editor.nodes(editor, {
        match: (n: any) => Element.isElement(n) && n.type === "paragraph",
      })
    );
    return !!match;
  };

  const isFormatActive = (editor: Editor, format: string) => {
    match.forEach(([node, path]: any) => {
      if ("type" in node && node.type === "paragraph") {
        console.log(node.children);
      }
    });
    return !!match;
  };
*/
  }
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton icon={<BiListUl />} aria-label="format options" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Format Options</PopoverHeader>
        <PopoverBody>
          <ButtonGroup>
            {toolbarButtons.map((button) => (
              <Tooltip label={button.label} key={button.format}>
                <IconButton icon={<button.icon />} aria-label={""} />
              </Tooltip>
            ))}
          </ButtonGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Toolbar;
