// src/pages/FeaturesPage.jsx
import React from "react";
import {
  NotebookText,
  FileText,
  ListChecks,
  FileCog,
  GitMerge,
  CheckCircle,
  Info,
} from "lucide-react";

const features = [
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
  {
    id: "ui",
    name: "UI Design",
    icon: <ListChecks size={30} />, // swap for your LayoutDashboard icon
    color: "bg-purple-400 hover:bg-purple-600",
    description: "Generate a UI design based on extracted requirements.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="px-6 py-12 max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-4">
        Choose a{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          Feature
        </span>
      </h2>
      <p className="text-neutral-400 mb-8">Pick one of the features to run.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-center">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center">
            <div className="group relative">
              <button
                className={`
                  flex items-center justify-center
                  w-24 h-24 rounded-full
                  text-white font-semibold shadow-md
                  transition-all
                  ${feature.color}
                  hover:opacity-100
                `}
              >
                {feature.icon}
              </button>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-44 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                {feature.description}
                <Info size={14} className="absolute -bottom-3 text-gray-900" />
              </div>
            </div>
            <span className="text-white mt-2 text-sm">{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
