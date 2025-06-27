import React, { useState, useRef } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import axios from "axios";
import UploadFile from "./UploadFile";
import MarkdownRenderer from "./MarkdownRenderer";
import html2canvas from "html2canvas";

export default function RequirementsFeature({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const markdownRef = useRef(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError("");
    try {
      const meeting_summary = await file.text();

      const res = await axios.post("http://localhost:5000/api/crewai/req", {
        meeting_summary,
      });

      if (res.data.success) {
        setOutput(res.data.data);
      } else {
        setError(res.data.message || "Unexpected API response");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to extract requirements. Is the server running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const savePdf = async () => {
    setPdfLoading(true);
    try {
      const element = markdownRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("requirements.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!output) {
    return (
      <UploadFile
        title="Extract Requirements"
        prompt="Upload a meeting summary (.txt) file."
        accept="text/plain"
        onUpload={handleUpload}
        onBack={onBack}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
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
          disabled={pdfLoading}
          className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full px-4 py-2 text-sm text-white hover:brightness-110 transition flex items-center space-x-2 disabled:opacity-50"
        >
          <Download size={16} />
          <span>{pdfLoading ? "Generating..." : "Save as PDF"}</span>
        </button>

        <h3 className="text-2xl font-semibold text-white mb-6">
          Extracted Requirements
        </h3>

        <div
          ref={markdownRef}
          className="h-full overflow-y-auto p-6 bg-white rounded-md prose prose-gray max-w-none text-gray-700 text-sm break-words"
        >
          <MarkdownRenderer content={output.extracted_requirements} />
        </div>
      </div>
    </div>
  );
}
