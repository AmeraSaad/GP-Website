// src/components/Step2.js
import { useState } from "react";
import {
  Mic,
  FileText,
  NotebookText,
  ListChecks,
  FileCog,
  LayoutDashboard,
  GitMerge,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const steps = [
  { id: "summary", name: "Meeting Summary", icon: NotebookText },
  { id: "minutes", name: "Meeting Minutes", icon: FileText },
  { id: "requirements", name: "Extract Requirements", icon: ListChecks },
  { id: "srs", name: "SRS Document", icon: FileCog },
  { id: "uml", name: "UML Diagram", icon: GitMerge },
  { id: "ui", name: "UI Design", icon: LayoutDashboard },
];

const Step2 = ({ selectedMode, handleFileUpload, goBack }) => {
  console.log("step 2");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validAudioFormats = ["audio/mpeg", "audio/wav", "audio/x-m4a"];
  const validTextFormats = ["text/plain", "application/msword"];

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (selectedMode === 1 && !validAudioFormats.includes(file.type)) {
      setError("Please upload a valid audio file (.mp3, .wav, .m4a)");
      setFileName("");
      return;
    }

    if (
      selectedMode === 2 &&
      !validAudioFormats.includes(file.type) &&
      !validTextFormats.includes(file.type)
    ) {
      setError("Please upload a valid text (.txt, .docx) or audio file (.mp3, .wav)");
      setFileName("");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setFileName(file.name);
      setError("");
      setLoading(false);
      handleFileUpload(file, selectedFeature);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center text-center w-full">
      <button
        onClick={goBack}
        className="self-start flex items-center space-x-2 text-neutral-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Mode 1: Full Pipeline */}
      {selectedMode === 1 && (
        <div>
          <h2 className="text-4xl font-bold mb-3">
            Upload Your <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">File</span>
          </h2>
          <p className="text-neutral-400 mb-6">Select a file to proceed.</p>
          {!fileName && (
            <label className="flex flex-col items-center px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg font-semibold shadow-md cursor-pointer transition-opacity duration-500 animate-fadeIn">
              <Mic size={24} className="mb-2" />
              <span>Upload Meeting Record</span>
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          )}
          {loading && (
            <div className="mt-4 flex items-center space-x-2 text-blue-500 animate-pulse">
              <Loader2 size={24} className="animate-spin" />
              <span>Processing...</span>
            </div>
          )}
          {fileName && !loading && <p className="text-purple-400 mt-4">Uploaded: {fileName}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Step2;

