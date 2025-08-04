// import React from 'react';
// import { Editor } from '@tiptap/react'; // Importa o tipo Editor
// // Importa ícones (exemplo com react-icons)
// import html2pdf from 'html2pdf.js';

// import {
//   FaBold,
//   FaAlignLeft,
//   FaAlignCenter,
//   FaAlignRight,
//   FaAlignJustify,
//   FaSave,
//   FaItalic, // Adicionando itálico para exemplo
//   FaUnderline, // Adicionando sublinhado para exemplo
//   FaStrikethrough, // Adicionando tachado para exemplo
//   FaListUl, // Lista não ordenada
//   FaListOl, // Lista ordenada
//   FaUndo, // Desfazer
//   FaRedo,
//   FaFilePdf, // Refazer
// } from 'react-icons/fa';
// import { IoColorFill } from "react-icons/io5"; // Exemplo para cor

// // Pode precisar instalar react-icons: npm install react-icons

// interface MenuBarProps {
//   editor: Editor | null;
//   onSave: () => void; // Prop para a função de salvar
// }

// const MenuBar: React.FC<MenuBarProps> = ({ editor, onSave }) => {
//   if (!editor) {
//     return null;
//   }

//   // Função auxiliar para renderizar botões
//   const renderButton = (
//     onClick: () => boolean,
//     isActive: boolean,
//     title: string,
//     icon: React.ReactNode,
//     disabled: boolean = false,
//     customStyle: React.CSSProperties = {} // Estilo customizado opcional
//   ) => (
//     <button
//       key={title} // Chave única para a lista de botões
//       onClick={onClick}
//       className={isActive ? 'is-active' : ''}
//       disabled={disabled}
//       title={title}
//       style={{
//         padding: '6px 8px', // Ajuste o padding
//         border: '1px solid #d1d5db', // Borda cinza clara
//         background: 'white',
//         cursor: 'pointer',
//         borderRadius: '4px', // Cantos mais arredondados
//         display: 'flex', // Para alinhar ícone e texto (se houver)
//         alignItems: 'center',
//         justifyContent: 'center',
//         ...customStyle, // Aplica estilos customizados
//       }}
//     >
//       {icon}
//     </button>
//   );


//   return (
//     <div className="editor-menubar" style={{ marginBottom: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap', border: '1px solid #d1d5db', padding: '8px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}> {/* Fundo cinza claro */}

//       {/* Botões de Formatação de Texto */}
//       {renderButton(
//         () => editor.chain().focus().toggleBold().run(),
//         editor.isActive('bold'),
//         'Negrito',
//         <FaBold />,
//         !editor.can().chain().focus().toggleBold().run()
//       )}
//        {/* Exemplo Itálico */}
//        {renderButton(
//          () => editor.chain().focus().toggleItalic().run(),
//          editor.isActive('italic'),
//          'Itálico',
//          <FaItalic />,
//          !editor.can().chain().focus().toggleItalic().run()
//        )}
//         {/* Exemplo Sublinhado (requer @tiptap/extension-underline) */}
//        {/* {renderButton(
//          () => editor.chain().focus().toggleUnderline().run(),
//          editor.isActive('underline'),
//          'Sublinhado',
//          <FaUnderline />,
//          !editor.can().chain().focus().toggleUnderline().run()
//        )} */}
//        {/* Exemplo Tachado (requer @tiptap/extension-strike) */}
//        {/* {renderButton(
//          () => editor.chain().focus().toggleStrike().run(),
//          editor.isActive('strike'),
//          'Tachado',
//          <FaStrikethrough />,
//          !editor.can().chain().focus().toggleStrike().run()
//        )} */}


//       {/* Botões de Alinhamento */}
//       {renderButton(
//         () => editor.chain().focus().setTextAlign('left').run(),
//         editor.isActive({ textAlign: 'left' }),
//         'Alinhar à Esquerda',
//         <FaAlignLeft />,
//         !editor.can().chain().focus().setTextAlign('left').run()
//       )}
//       {renderButton(
//         () => editor.chain().focus().setTextAlign('center').run(),
//         editor.isActive({ textAlign: 'center' }),
//         'Alinhar ao Centro',
//         <FaAlignCenter />,
//         !editor.can().chain().focus().setTextAlign('center').run()
//       )}
//       {renderButton(
//         () => editor.chain().focus().setTextAlign('right').run(),
//         editor.isActive({ textAlign: 'right' }),
//         'Alinhar à Direita',
//         <FaAlignRight />,
//         !editor.can().chain().focus().setTextAlign('right').run()
//       )}
//       {renderButton(
//         () => editor.chain().focus().setTextAlign('justify').run(),
//         editor.isActive({ textAlign: 'justify' }),
//         'Justificar',
//         <FaAlignJustify />,
//         !editor.can().chain().focus().setTextAlign('justify').run()
//       )}

//        {/* Botões de Lista (requer @tiptap/extension-bullet-list e @tiptap/extension-ordered-list) */}
//        {/* {renderButton(
//          () => editor.chain().focus().toggleBulletList().run(),
//          editor.isActive('bulletList'),
//          'Lista Não Ordenada',
//          <FaListUl />,
//          !editor.can().chain().focus().toggleBulletList().run()
//        )} */}
//         {/* {renderButton(
//          () => editor.chain().focus().toggleOrderedList().run(),
//          editor.isActive('orderedList'),
//          'Lista Ordenada',
//          <FaListOl />,
//          !editor.can().chain().focus().toggleOrderedList().run()
//        )} */}


//       {/* Botão de Cor */}
//        <input
//         key="color-picker" // Chave única para o input
//         type="color"
//         onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
//         title="Cor do Texto"
//          style={{ padding: '0', border: 'none', background: 'none', cursor: 'pointer', height: '30px', width: '30px', minWidth: 'unset' }} // Ajusta o estilo do input color
//        />
//        {/* Botão para remover a cor */}
//        {renderButton(
//            () => editor.chain().focus().unsetColor().run(),
//             false, // Não há estado "ativo" simples para cor removida
//             'Remover Cor',
//             <IoColorFill color="#000" />,
//             !editor.can().chain().focus().unsetColor().run()
//        )}

//        {/* Botões Desfazer/Refazer (requer @tiptap/extension-history) */}
//        {/* {renderButton(
//          () => editor.chain().focus().undo().run(),
//          false, // Não há estado ativo
//          'Desfazer',
//          <FaUndo />,
//          !editor.can().chain().focus().undo().run() // Desabilitado se não puder desfazer
//        )} */}
//         {/* {renderButton(
//          () => editor.chain().focus().redo().run(),
//          false, // Não há estado ativo
//          'Refazer',
//          <FaRedo />,
//          !editor.can().chain().focus().redo().run() // Desabilitado se não puder refazer
//        )} */}


//       {/* Botão Salvar - Agora cinza */}
//        {renderButton(
//            () => { onSave(); return true; },
//            true, // Botão salvar não tem estado ativo
//            'Salvar Relatório',
//            <FaSave />,
//            false, // Não desabilitado por padrão, a menos que adicione lógica
//            {
//              background: '#d1d5db', // Cor de fundo cinza
//              fontWeight: 'bold',
//              marginLeft: 'auto', // Empurra para a direita
//              padding: '6px 12px', // Ajusta o padding
//            }
//        )}
//        {renderButton(
//   () => {
//     const contentElement = document.querySelector('.ProseMirror');
//     if (contentElement) {
//       html2pdf()
//         .from(contentElement)
//         .set({
//           margin: 10,
//           filename: 'relatorio.pdf',
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//         })
//         .save();
//     }
//     return true;
//   },
//   false,
//   'Gerar PDF',
//   <FaFilePdf />,
//   false,
//   {
//     background: '#f87171', // Vermelho claro
//     color: 'white',
//     fontWeight: 'bold',
//     padding: '6px 12px',
//   }
// )}



//        {/* Adicione mais botões conforme as extensões que usar (itálico, lista, etc.) */}


//        <style jsx>{`
//          .editor-menubar button {
//             transition: background-color 0.2s ease; /* Transição suave */
//          }
//          .editor-menubar button:hover:not(:disabled) {
//            background-color: #e5e7eb; /* Cor de fundo ao passar o mouse */
//          }
//          .editor-menubar .is-active {
//            background-color: #d1d5db; /* Cor de fundo para botões ativos (cinza) */
//          }
//           .editor-menubar button:disabled {
//               opacity: 0.5;
//               cursor: not-allowed;
//           }
//        `}</style>
//     </div>
//   );
// };

// export default MenuBar;
