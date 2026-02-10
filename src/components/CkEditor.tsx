"use client";
import { useState } from "react";

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
}

const SimpleEditor: React.FC<EditorProps> = ({ content, setContent }) => {
  return (
    <div className="col-span-3 mb-16">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[250px] p-4 border border-gray-300 rounded-md resize-none"
        placeholder="İçeriği buraya yazın..."
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => setContent(content + " **kalın** ")}
          className="px-3 py-1 text-sm bg-gray-200 rounded-md"
        >
          Kalın
        </button>
        <button
          type="button"
          onClick={() => setContent(content + " _italik_ ")}
          className="px-3 py-1 text-sm bg-gray-200 rounded-md"
        >
          İtalik
        </button>
        <button
          type="button"
          onClick={() => setContent(content + "\n- Liste öğesi\n")}
          className="px-3 py-1 text-sm bg-gray-200 rounded-md"
        >
          Liste
        </button>
      </div>
    </div>
  );
};

export default SimpleEditor;
