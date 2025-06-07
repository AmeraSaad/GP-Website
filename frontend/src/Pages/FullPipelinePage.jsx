// src/pages/FullPipelinePage.jsx
import React, { useState } from "react";
import {
  Mic,
  Loader2,
  ArrowLeft,
  NotebookText,
  FileText,
  ListChecks,
  FileCog,
  GitMerge,
  CheckCircle,
  Info,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import UmlRenderer from "../components/UmlRenderer";

const steps = [
  {
    id: "summary",
    name: "Meeting Summary",
    icon: <NotebookText size={30} />,
    color: "bg-yellow-400 hover:bg-yellow-600",
    description: "Summarize the key points of the meeting.",
  },
  {
    id: "minutes",
    name: "Meeting Minutes",
    icon: <FileText size={30} />,
    color: "bg-blue-400 hover:bg-blue-600",
    description: "Generate structured meeting minutes.",
  },
  {
    id: "requirements",
    name: "Extract Requirements",
    icon: <ListChecks size={30} />,
    color: "bg-green-400 hover:bg-green-600",
    description: "Identify functional and non-functional requirements.",
  },
  {
    id: "srs",
    name: "SRS Document",
    icon: <FileCog size={30} />,
    color: "bg-red-400 hover:bg-red-600",
    description: "Create a Software Requirements Specification document.",
  },
  {
    id: "uml",
    name: "UML Diagram",
    icon: <GitMerge size={30} />,
    color: "bg-indigo-400 hover:bg-indigo-600",
    description: "Generate UML diagrams from the discussion.",
  },
];

export default function FullPipelinePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState([]);
  const [active, setActive] = useState(null);

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    setLoading(true);
    try {
      // Directly call backend
      const formData = new FormData();
      formData.append("audio", f);
      const resp = await fetch(
        "http://localhost:5000/api/full-pipeline/audio",
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await resp.json();
      if (res.success) {
        setOutputs(res.data);
      } else {
        setError(res.message || "Unexpected response");
      }
    } catch {
      setError("Failed to process file.");
    } finally {
      setLoading(false);
    }
  };

  // 1) Upload step
  if (!outputs) {
    return (
      <div className="flex flex-col items-center text-center pt-32 space-y-6">
        <h2 className="text-4xl font-bold">
          Run{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
            Full Pipeline
          </span>
        </h2>
        <p className="text-neutral-400 max-w-md">
          Upload your meeting recording and get transcript, summary, minutes,
          requirements, SRS & UML—in one go.
        </p>

        <label className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition w-64">
          <Mic size={40} className="mb-3 text-blue-500" />
          <span className="text-xl font-semibold text-white">
            Upload Meeting File
          </span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>

        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {loading && (
          <div className="mt-6 flex items-center space-x-2 text-blue-500 animate-pulse">
            <Loader2 size={24} className="animate-spin" />
            <span>Processing...</span>
          </div>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    );
  }

  // Map step IDs → rendered content
  const contentMap = {
    summary: (
      <div className="whitespace-pre-wrap text-neutral-200">
        {outputs.summaryText}
      </div>
    ),
    minutes: (
      <pre className="whitespace-pre-wrap text-neutral-200">
        {outputs.minutes}
      </pre>
    ),
    requirements: (
      <div className="text-neutral-200">
        <ReactMarkdown>
          {outputs.extracted_requirements}
        </ReactMarkdown>
      </div>
    ),
    srs: (
      <div className="text-neutral-200">
        <ReactMarkdown>
          {outputs.srs_document}
        </ReactMarkdown>
      </div>
    ),
    uml: <UmlRenderer umlCode={outputs.uml_diagram} />,
  };

  const clickStep = (id) => {
    setActive(id);
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto space-y-8">
      {/* Back to Upload */}
      <button
        onClick={() => {
          setOutputs(null);
          setFile(null);
          setActive(null);
          setCompleted([]);
          setError("");
        }}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>Back to Upload</span>
      </button>

      {/* Steps grid */}
      <div className="grid grid-cols-5 gap-6 justify-center">
        {steps.map((step) => {
          const done = completed.includes(step.id);
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className="group relative">
                <button
                  onClick={() => clickStep(step.id)}
                  className={`
                    flex flex-col items-center justify-center
                    w-24 h-24 rounded-full text-white font-semibold shadow-md transition-all
                    ${step.color} ${done ? "opacity-70" : "hover:opacity-100"}
                  `}
                >
                  {done ? <CheckCircle size={40} /> : step.icon}
                </button>
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-44 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                  {step.description}
                  <Info
                    size={14}
                    className="absolute -bottom-3 text-gray-900"
                  />
                </div>
              </div>
              <span className="text-white mt-2 text-sm text-center">
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active step's output container */}
      {active && (
        <div className="relative mt-6 p-6 pb-12 bg-gray-800 rounded-lg shadow-md w-full">
          {/* Save as PDF */}
          <button
            onClick={async () => {
              const { jsPDF } = await import("jspdf");
              const pdf = new jsPDF();
              const text = (() => {
                switch (active) {
                  case "summary":
                    return outputs.summaryText;
                  case "minutes":
                    return outputs.minutes;
                  case "requirements":
                    return outputs.extracted_requirements;
                  case "srs":
                    return outputs.srs_document;
                  case "uml":
                    return outputs.uml_diagram;
                  default:
                    return "";
                }
              })();
              const lines = pdf.splitTextToSize(text, 180);
              pdf.text(lines, 10, 10);
              pdf.save(`${active}.pdf`);
            }}
            className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
          >
            Save as a PDF
          </button>

          {/* Section title */}
          <h3 className="text-xl font-semibold text-white mb-4">
            {steps.find((s) => s.id === active).name}
          </h3>

          {/* Content box with max-height and scroll */}
          <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm whitespace-pre-wrap break-words">
            {contentMap[active]}
          </div>
        </div>
      )}
    </div>
  );
}
