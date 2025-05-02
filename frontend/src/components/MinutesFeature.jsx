// src/components/MinutesFeature.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import UploadFile from "./UploadFile";

export default function MinutesFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      // 1. Read transcript text
      const transcript = await file.text();

      // 2. Call minutes API
      const res = await axios.post("http://localhost:5000/api/minutes", {
        transcript,
      });

      if (res.data.success) {
        setOutput(res.data);
      } else {
        setError(res.data.message || "Unexpected API response");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate minutes. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show upload card
  if (!output) {
    return (
      <UploadFile
        title="Meeting Minutes"
        prompt="Upload a meeting transcript file."
        accept="text/plain"
        onUpload={handleUpload}
        onBack={onBack}
        loading={loading}
        error={error}
      />
    );
  }

  // Save PDF
  const savePdf = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(output.minutes, 180);
    pdf.text(lines, 10, 10);
    pdf.save("meeting-minutes.pdf");
  };

  // Display results
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

      {/* Container */}
      <div className="mt-6 p-6 pb-20 bg-gray-800 rounded-lg shadow-md w-full relative">
        {/* Save as PDF */}
        <button
          onClick={savePdf}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
        >
          Save as a PDF
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">
          Meeting Minutes
        </h3>

        <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm whitespace-pre-wrap break-words">
          {output.minutes}
        </div>
      </div>
    </div>
  );
}
