import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import UploadFile from "./UploadFile";
import UmlRenderer from "./UmlRenderer";

export default function UmlFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      // 1. Read the summary text
      const meeting_summary = await file.text();

      // 2. Call your UML API
      const res = await axios.post("http://localhost:5000/api/crewai/uml", {
        meeting_summary,
      });

      if (res.data.success) {
        // Response shape: { success: true, data: { uml_diagram: "@startuml\n..."} }
        setOutput(res.data.data);
      } else {
        setError(res.data.message || "Unexpected API response");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to generate UML. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  // 1) Upload step
  if (!output) {
    return (
      <UploadFile
        title="UML Diagram"
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
  const savePdf = () => {
    const umlCode = output.uml_diagram;
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(umlCode, 180);
    pdf.text(lines, 10, 10);
    pdf.save("uml-diagram.pdf");
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
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
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
        >
          Save as a PDF
        </button>

        <h3 className="text-xl font-semibold text-white mb-4">UML Diagram</h3>

        <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm">
          <UmlRenderer umlCode={output.uml_diagram} />
        </div>
      </div>
    </div>
  );
}
