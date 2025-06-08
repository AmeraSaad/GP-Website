// src/components/MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="text-2xl font-bold mb-4 text-gray-900"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-xl font-bold mb-3 text-gray-800"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-lg font-bold mb-2 text-gray-700"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 mb-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
        code: ({ node, ...props }) => (
          <code
            className="bg-gray-100 px-1 py-0.5 rounded text-sm"
            {...props}
          />
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <table className="min-w-full border border-gray-300 bg-white my-4">
            {props.children}
          </table>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-100">{props.children}</thead>
        ),
        th: ({ node, ...props }) => (
          <th className="px-4 py-2 border-b border-gray-300 text-left font-semibold">
            {props.children}
          </th>
        ),
        td: ({ node, ...props }) => (
          <td className="px-4 py-2 border-b border-gray-200">
            {props.children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
