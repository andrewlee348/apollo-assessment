import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import MenuBar from "./components/MenuBar";

import { useEffect, useState } from "react";

interface TipTapDocProps {
  initialContent: string;
  onSave: (html: string) => void;
}

const TipTapDoc: React.FC<TipTapDocProps> = ({ initialContent, onSave }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
  });

  const handleSave = () => {
    if (editor) {
      const html = editor.getHTML();
      onSave(html);
    }
  };

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} />}
      <EditorContent
        style={{ margin: "0.75rem" }}
        className="editor__content"
        editor={editor}
      />
      <button
        className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
        onClick={handleSave} // Save current content
        style={{ marginTop: "2rem" }}
      >
        <svg
          className="fill-current shrink-0 xs:hidden"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
        <span className="max-xs:sr-only">Save Document</span>
      </button>
      {/* Ensure save button triggers handleSave */}
    </div>
  );
};

export default TipTapDoc;
