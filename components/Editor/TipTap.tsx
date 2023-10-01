import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";
import { schema } from "prosemirror-markdown";
import { defaultMarkdownSerializer } from "prosemirror-markdown";
import { ReactElement } from "react";

interface TipTapProps {
  onContentChange: (content: string) => void;
  content?: string;
  readOnly?: boolean;
}

const TipTap = ({
  onContentChange,
  content = "*Hello World!* 🌎️",
  readOnly = false,
}: TipTapProps): ReactElement | null => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenu.configure({
        element: document.querySelector(".menu") as HTMLElement | null,
        shouldShow: ({ editor }) => {
          return editor.isActive("image") || editor.isActive("link");
        },
      }),
      Dropcursor.configure({
        color: "#ff0000",
        width: 2,
      }),
    ],
    content: content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const doc = editor.state.doc;
      const markdown = defaultMarkdownSerializer.serialize(doc);
      onContentChange(markdown);
    },
  });

  return <EditorContent editor={editor} />;
};

export default TipTap;
