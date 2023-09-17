"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = ({ onContentChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onContentChange(json);
    },
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
