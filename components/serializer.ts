// serializer.ts

export function serializeTipTapToMarkdown(content: any): string {
  let markdown = "";

  if (content.type === "doc" && content.content) {
    content.content.forEach((node: any) => {
      switch (node.type) {
        case "paragraph":
          markdown += serializeTipTapToMarkdown(node) + "\n\n";
          break;
        case "text":
          markdown += node.text;
          break;
        case "bold":
          markdown += `**${serializeTipTapToMarkdown(node)}**`;
          break;
        // ... handle other node types as needed ...
        default:
          console.warn("Unhandled node type:", node.type);
          break;
      }
    });
  }

  return markdown;
}
