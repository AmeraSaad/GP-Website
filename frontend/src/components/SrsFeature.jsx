import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import UploadFile from "./UploadFile";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SrsFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      // 1. Read the summary text
      const meeting_summary = await file.text();

      // 2. Call your SRS API
      const res = await axios.post("http://localhost:5000/api/crewai/srs", {
        meeting_summary,
      });

      if (res.data.success) {
        // Response shape: { success: true, data: { srs_document: "..." } }
        setOutput(res.data.data);
      } else {
        setError(res.data.message || "Unexpected API response");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate SRS. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  // 1) Upload step
  if (!output) {
    return (
      <UploadFile
        title="SRS Document"
        prompt="Upload a meeting summary (.txt) file."
        accept="text/plain"
        onUpload={handleUpload}
        onBack={onBack}
        loading={loading}
        error={error}
      />
    );
  }

  // 2) Display + save PDF
  const savePdf = async () => {
    setPdfLoading(true);
    try {
      const text = output.srs_document;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Set font and size
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      // Add title
      pdf.setFontSize(16);
      pdf.text("Software Requirements Specification", 20, 20);
      pdf.setFontSize(11);
      
      // Split text into lines and add to PDF
      const lines = pdf.splitTextToSize(text, 170);
      let y = 30;
      const lineHeight = 7;
      
      lines.forEach(line => {
        if (y > 270) { // Check if we need a new page
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 20, y);
        y += lineHeight;
      });
      
      pdf.save("srs-document.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => setOutput(null)}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Container */}
      <div className="mt-6 p-6 pb-20 bg-gray-800 rounded-lg shadow-md w-full relative">
        {/* Save as PDF */}
        <button
          onClick={savePdf}
          disabled={pdfLoading}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full px-4 py-2 text-sm text-white hover:brightness-110 transition flex items-center space-x-2 disabled:opacity-50"
        >
          <Download size={16} />
          <span>{pdfLoading ? "Generating..." : "Save as PDF"}</span>
        </button>

        <h3 className="text-2xl font-semibold text-white mb-6">SRS Document</h3>

        <div className="h-full overflow-y-auto p-6 bg-gray-50 rounded-md prose prose-gray max-w-none text-gray-700 text-sm break-words">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 text-gray-900" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 text-gray-800" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 text-gray-700" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-2" {...props} />,
              code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto" {...props} />
            }}
          >
            {output.srs_document}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
