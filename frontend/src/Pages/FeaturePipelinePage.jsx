// src/pages/FeaturePipelinePage.jsx
import React, { useState } from "react";
import {
  NotebookText,
  FileText,
  ListChecks,
  FileCog,
  GitMerge,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

// Import each feature component
import SummaryFeature from "../components/SummaryFeature";
import MinutesFeature from "../components/MinutesFeature";
import RequirementsFeature from "../components/RequirementsFeature";
import SrsFeature from "../components/SrsFeature";
import UmlFeature from "../components/UmlFeature";
import UIGenerator from "../components/UIGenerator";

const features = [
  {
    id: "summary",
    name: "Meeting Summary",
    icon: <NotebookText size={30} />,
    color: "bg-yellow-400 hover:bg-yellow-500",
  },
  {
    id: "minutes",
    name: "Meeting Minutes",
    icon: <FileText size={30} />,
    color: "bg-blue-400 hover:bg-blue-500",
  },
  {
    id: "requirements",
    name: "Extract Requirements",
    icon: <ListChecks size={30} />,
    color: "bg-green-400 hover:bg-green-500",
  },
  {
    id: "srs",
    name: "SRS Document",
    icon: <FileCog size={30} />,
    color: "bg-red-400 hover:bg-red-500",
  },
  {
    id: "uml",
    name: "UML Diagram",
    icon: <GitMerge size={30} />,
    color: "bg-indigo-400 hover:bg-indigo-500",
  },
  {
    id: "ui",
    name: "UI Genterator",
    icon: <LayoutDashboard size={30} />,
    color: "bg-purple-400 hover:bg-purple-500",
  },
];

export default function FeaturePipelinePage() {
  const [selected, setSelected] = useState(null);

  // When a feature is selected, this will render its component
  if (selected) {
    switch (selected) {
      case "summary":
        return <SummaryFeature onBack={() => setSelected(null)} />;
      case "minutes":
        return <MinutesFeature onBack={() => setSelected(null)} />;
      case "requirements":
        return <RequirementsFeature onBack={() => setSelected(null)} />;
      case "srs":
        return <SrsFeature onBack={() => setSelected(null)} />;
      case "uml":
        return <UmlFeature onBack={() => setSelected(null)} />;
      case "ui":
        return <UIGenerator onBack={() => setSelected(null)} />;
      default:
        return null;
    }
  }

  // Otherwise show the 6‐option grid
  return (
    <div className="flex flex-col items-center text-center pt-20 px-6">
      <h2 className="text-4xl font-bold mb-3">
        Select Your{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          Feature
        </span>
      </h2>
      <p className="text-neutral-400 mb-8">
        Choose a specific feature to run the pipeline.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.id} className="flex justify-center">
            <button
              onClick={() => setSelected(f.id)}
              className={`
                flex flex-col items-center justify-center
                w-48 h-32 rounded-xl text-white font-semibold shadow-md
                transition ${f.color}
              `}
            >
              {f.icon}
              <span className="mt-2">{f.name}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
