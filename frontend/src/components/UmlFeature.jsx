// src/components/UmlFeature.jsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
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
      // TODO: replace with your real API call
      const fake = {
        success: true,
        data: { uml_diagram: "@startuml\nAlice->Bob: Hello\n@enduml" },
      };
      setOutput(fake.data);
    } catch {
      setError("Failed to generate UML");
    } finally {
      setLoading(false);
    }
  };

  if (!output) {
    return (
      <UploadFile
        title="UML Diagram"
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
    const svg = output.uml_diagram;
    // PDF save of UML could be more complex; for now just text
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(svg, 180);
    pdf.text(lines, 10, 10);
    pdf.save("uml-diagram.pdf");
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

        <h3 className="text-xl font-semibold text-white mb-4">UML Diagram</h3>

        <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm break-words">
          <UmlRenderer umlCode={output.uml_diagram} />
        </div>
      </div>
    </div>
  );
}
