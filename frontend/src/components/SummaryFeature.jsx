// src/components/SummaryFeature.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import UploadFile from "./UploadFile";
import { jsPDF } from "jspdf";
import axios from "axios";

export default function SummaryFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      // Read the text from the .txt file
      const transcript = await file.text();

      // Call your backend
      const res = await axios.post("http://localhost:5000/api/summaries", {
        transcript,
      });

      if (res.data.success) {
        // The API returns data.summaryText
        setOutput(res.data.data);
      } else {
        setError(res.data.message || "Unexpected API response");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate summary. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!output) {
    return (
      <UploadFile
        title="Meeting Summary"
        prompt="Upload a meeting transcript file."
        accept="text/plain"
        onUpload={handleUpload}
        onBack={onBack}
        loading={loading}
        error={error}
      />
    );
  }

  // Save PDF handler
  const handleSavePdf = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(output.summaryText, 180);
    pdf.text(lines, 10, 10);
    pdf.save("meeting-summary.pdf");
  };

  // Result display
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      {/* Back to upload */}
      <button
        onClick={() => setOutput(null)}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Step3-style container */}
      <div className="mt-6 p-6 pb-12 bg-gray-800 rounded-lg shadow-md w-full relative">
        {/* Save as PDF */}
        <button
          onClick={handleSavePdf}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
        >
          Save as a PDF
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">
          Meeting Summary
        </h3>

        <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm whitespace-pre-wrap break-words">
          {output.summaryText}
        </div>
      </div>
    </div>
  );
}
