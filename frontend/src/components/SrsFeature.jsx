// src/components/SrsFeature.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import UploadFile from "./UploadFile";
import ReactMarkdown from "react-markdown";

export default function SrsFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      // TODO: replace with your real API call
      const fake = {
        success: true,
        data: { srs_document: "# SRS Title\n\n## Section\n\nDetails..." },
      };
      setOutput(fake.data);
    } catch {
      setError("Failed to generate SRS");
    } finally {
      setLoading(false);
    }
  };

  if (!output) {
    return (
      <UploadFile
        title="SRS Document"
        prompt="Upload a meeting summary file."
        accept="text/plain"
        onUpload={handleUpload}
        onBack={onBack}
        loading={loading}
        error={error}
      />
    );
  }

  const savePdf = () => {
    const text = output.srs_document;
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 10, 10);
    pdf.save("srs-document.pdf");
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <button
        onClick={() => setOutput(null)}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="mt-6 p-6 pb-20 bg-gray-800 rounded-lg shadow-md w-full relative">
        <button
          onClick={savePdf}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
        >
          Save as a PDF
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">SRS Document</h3>

        <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 prose prose-invert text-sm break-words">
          <ReactMarkdown>{output.srs_document}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
