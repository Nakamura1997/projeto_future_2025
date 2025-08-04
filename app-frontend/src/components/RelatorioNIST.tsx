"use client";

import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface RelatorioNISTProps {
  htmlContent?: string | null;
}

const RelatorioNIST: React.FC<RelatorioNISTProps> = ({ htmlContent }) => {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState<string>(
    htmlContent || "<p>Carregando conteúdo do relatório...</p>"
  );

  useEffect(() => {
    if (htmlContent) {
      setContent(htmlContent);
    }
  }, [htmlContent]);

  const handleSave = () => {
    if (editorRef.current) {
      const editedContent = editorRef.current.getContent();
      console.log("Conteúdo salvo:", editedContent);
      // Aqui você pode enviar para o backend ou gerar Word/PDF a partir do conteúdo editado
    }
  };

  return (
    <div className="editor-container">
      <Editor
        apiKey="i1akh87r0zd7ogazh6m7faw9seiv03oquwm3jbxum8hdogw0"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={content}
        init={{
          height: 600,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Salvar Conteúdos
      </button>
    </div>
  );
};

export default RelatorioNIST;
