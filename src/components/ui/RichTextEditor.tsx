"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  setContent: (content: string) => void;
  placeholder?: string;
}

const SimpleRichTextEditor = ({
  content,
  setContent,
  placeholder = "Açıklama yazın...",
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    saveToHistory(newContent);
  };

  const formatText = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    setContent(newText);
    saveToHistory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);

    const newText = `${before}${text}${after}`;
    setContent(newText);
    saveToHistory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  };

  const toolbarButtons = [
    {
      icon: <Heading1 size={16} />,
      title: "Başlık 1",
      action: () => formatText("# ", "\n"),
    },
    {
      icon: <Heading2 size={16} />,
      title: "Başlık 2",
      action: () => formatText("## ", "\n"),
    },
    {
      icon: <Heading3 size={16} />,
      title: "Başlık 3",
      action: () => formatText("### ", "\n"),
    },
    {
      icon: <Bold size={16} />,
      title: "Kalın",
      action: () => formatText("**", "**"),
    },
    {
      icon: <Italic size={16} />,
      title: "İtalik",
      action: () => formatText("*", "*"),
    },

    {
      icon: <Minus size={16} />,
      title: "Çizgi",
      action: () => insertAtCursor("\n---\n"),
    },
    {
      icon: <Undo size={16} />,
      title: "Geri Al",
      action: undo,
      disabled: historyIndex === 0,
    },
    {
      icon: <Redo size={16} />,
      title: "İleri Al",
      action: redo,
      disabled: historyIndex === history.length - 1,
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            disabled={button.disabled}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              button.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={button.title}
          >
            {button.icon}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-64 p-4 resize-none focus:outline-none focus:ring-0"
      />

      <div className="border-t border-gray-300 p-3 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-600">Önizleme:</span>
        </div>
        <div className="prose prose-sm max-w-none p-2 bg-white rounded border min-h-[60px]">
          {content ? (
            <div className="whitespace-pre-wrap text-sm">
              {content.split("\n").map((line, i) => {
                if (line.startsWith("# "))
                  return (
                    <h1 key={i} className="text-xl font-bold mt-2 mb-1">
                      {line.substring(2)}
                    </h1>
                  );
                if (line.startsWith("## "))
                  return (
                    <h2 key={i} className="text-lg font-bold mt-2 mb-1">
                      {line.substring(3)}
                    </h2>
                  );
                if (line.startsWith("### "))
                  return (
                    <h3 key={i} className="text-md font-bold mt-2 mb-1">
                      {line.substring(4)}
                    </h3>
                  );
                if (line.startsWith("- "))
                  return (
                    <div key={i} className="ml-4">
                      • {line.substring(2)}
                    </div>
                  );
                if (line.startsWith("1. "))
                  return (
                    <div key={i} className="ml-4">
                      1. {line.substring(3)}
                    </div>
                  );
                if (line === "---") return <hr key={i} className="my-2" />;

                const boldRegex = /\*\*(.*?)\*\*/g;
                const italicRegex = /\*(.*?)\*/g;
                const codeRegex = /`(.*?)`/g;
                const linkRegex = /\[(.*?)\]\((.*?)\)/g;

                let processedLine = line;
                processedLine = processedLine.replace(
                  boldRegex,
                  "<strong>$1</strong>"
                );
                processedLine = processedLine.replace(
                  italicRegex,
                  "<em>$1</em>"
                );
                processedLine = processedLine.replace(
                  codeRegex,
                  '<code class="bg-gray-100 px-1 rounded">$1</code>'
                );
                processedLine = processedLine.replace(
                  linkRegex,
                  '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
                );

                return (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{ __html: processedLine }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 italic">
              Önizleme burada görünecek...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleRichTextEditor;
