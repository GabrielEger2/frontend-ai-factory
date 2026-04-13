"use client";

import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

export function getLanguageFromPath(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();

  switch (ext) {
    case ".tsx":
    case ".jsx":
    case ".ts":
      return "typescript";
    case ".js":
    case ".mjs":
      return "javascript";
    case ".css":
      return "css";
    case ".json":
      return "json";
    case ".html":
      return "html";
    default:
      return "plaintext";
  }
}

export function MonacoEditor({
  value,
  language,
  onChange,
  readOnly = false,
}: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        readOnly,
      }}
    />
  );
}
