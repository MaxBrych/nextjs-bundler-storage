import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";
import { ReactElement } from "react";

interface TipTapProps {
  onContentChange: (content: any) => void;
  content?: string;
  readOnly?: boolean;
}

const TipTap = ({
  onContentChange,
  content = "<p>Hello World! 🌎️</p>",
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
      const json = editor.getJSON();
      onContentChange(json);
    },
  });

  return <EditorContent editor={editor} />;
};

export default TipTap;
