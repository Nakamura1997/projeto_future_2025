"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Dialog } from "@headlessui/react";
import { FiX, FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useReports } from "@/hooks/useReports";

interface EditorRelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHtml: string;
}

export default function EditorRelatorioModal({
  isOpen,
  onClose,
  initialHtml,
}: EditorRelatorioModalProps) {
  const { generateDocxOrPdfFromHtml } = useReports();
  const [htmlContent, setHtmlContent] = useState(initialHtml);

  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlContent,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  const handleExportWord = async () => {
    if (!htmlContent) return;
    await generateDocxOrPdfFromHtml(htmlContent, "docx");
  };

  useEffect(() => {
    if (editor && initialHtml) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-xl max-w-5xl w-full h-[90%] p-4 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Editar Relatório</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <FiX size={20} />
          </button>
        </div>
        {editor && (
          <EditorContent
            editor={editor}
            className="border rounded flex-1 overflow-y-auto p-2"
          />
        )}
        <button
          onClick={handleExportWord}
          className="mt-2 p-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <FiDownload /> Exportar Word
        </button>
      </div>
    </Dialog>
  );
}
