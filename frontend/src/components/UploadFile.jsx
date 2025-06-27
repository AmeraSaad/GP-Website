// src/components/UploadFile.jsx
import React, { useState } from "react";
import { UploadCloud, Loader2, ArrowLeft } from "lucide-react";

export default function UploadFile({
  title,
  prompt,
  accept,
  onUpload,
  onBack,
  loading,
  error: externalError,
}) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;

    // Enforce accepted mime types
    if (accept.split(",").indexOf(f.type) === -1) {
      setError(`Please upload a file of type: ${accept}`);
      setFileName("");
      return;
    }

    setFileName(f.name);
    await onUpload(f);
  };

  return (
    <div className="flex flex-col items-center text-center pt-20 space-y-6">
      {/* Dynamic title */}
      <h2 className="text-4xl font-bold text-white">{title}</h2>
      {/* Dynamic prompt */}
      <p className="text-neutral-400">{prompt}</p>

      {/* Upload card */}
      <label className="flex flex-col items-center p-8 bg-gray-900 hover:bg-gray-800 rounded-2xl cursor-pointer transition w-80 h-48">
        <UploadCloud size={48} className="mb-4 text-blue-500" />
        <span className="text-xl font-semibold text-white">Upload File</span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {/* Filename, loading, errors */}
      {fileName && !loading && (
        <p className="text-neutral-200">
          Selected: <strong>{fileName}</strong>
        </p>
      )}
      {loading && (
        <div className="flex items-center space-x-2 text-blue-500 animate-pulse">
          <Loader2 size={24} className="animate-spin" />
          <span>Processing...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!error && externalError && (
        <p className="text-red-500">{externalError}</p>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>
    </div>
  );
}
