// hooks/useReportTiptapEditor.ts
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

export const useReportTiptapEditor = (
  initialContent: string,
  onUpdate?: (content: string) => void
) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  return editor;
};
