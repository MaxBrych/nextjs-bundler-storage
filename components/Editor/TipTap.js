"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";

const Tiptap = ({
  onContentChange,
  content = "<p>Hello World! 🌎️</p>",
  readOnly = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenu.configure({
        element: document.querySelector(".menu"), // You'll need to add a DOM element with class 'menu' for the bubble menu
        shouldShow: ({ editor }) => {
          // Only show the bubble menu for images and links
          return editor.isActive("image") || editor.isActive("link");
        },
      }),
      Dropcursor.configure({
        color: "#ff0000", // Red color for the dropcursor
        width: 2, // Width of the dropcursor
      }),
    ],
    content: content, // Set the initial content using the content prop
    editable: !readOnly, // If readOnly is true, make it not editable
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onContentChange(json);
    },
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
