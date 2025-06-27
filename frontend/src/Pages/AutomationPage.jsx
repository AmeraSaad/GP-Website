// src/components/AutomationLanding.jsx
import { PlayCircle, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";


export default function AutomationPage() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col items-center text-center pt-20">
      <h2 className="text-4xl font-bold mb-3">
        Select Your{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          Workflow
        </span>
      </h2>
      <p className="text-neutral-400 mb-6">
        Choose whether to run the full pipeline or a specific feature.
      </p>

      <div className="flex flex-col space-y-6 w-full max-w-sm">
        <div
          onClick={() => nav("/start-automation/full")}
          className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition"
        >
          <PlayCircle size={40} className="mb-3 text-blue-500" />
          <span className="text-xl font-semibold text-white">
            Run Full Pipeline
          </span>
        </div>

        <div
          onClick={() => nav("/start-automation/custom")}
          className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition"
        >
          <ListChecks size={40} className="mb-3 text-blue-500" />
          <span className="text-xl font-semibold text-white">
            Choose a Specific Feature
          </span>
        </div>
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
