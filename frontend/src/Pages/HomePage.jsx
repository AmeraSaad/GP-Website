// src/HomePage.jsx
import React, { useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setResponseData(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setResponseData(null);

      // Read the transcript text from the .txt file
      const text = await file.text();

      // Build form-data
      const formData = new FormData();
      formData.append("transcript", text);

      // Send to backend
      const response = await axios.post(
        "http://localhost:5000/api/meetings",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Log the full response
      console.log("Full Response from Backend:", response.data);

      // Extract data and drop meetingId & summaryId
      const { data } = response.data;
      const { meetingId, summaryId, ...displayData } = data;

      setResponseData(displayData);
      setMessage("Meeting processed successfully!");
    } catch (error) {
      console.error("Upload Error:", error.response || error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Upload Meeting Transcript</h1>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="block w-full text-gray-700"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Processing..." : "Upload & Process"}
        </button>

        {message && <p className="mt-4 text-center text-gray-800">{message}</p>}

        {responseData && (
          <div className="mt-6 space-y-4">
            {Object.entries(responseData).map(([key, value]) => (
              <div key={key}>
                <h2 className="font-semibold">{key.replace(/_/g, " ")}:</h2>
                <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-sm">
                  {typeof value === "string"
                    ? value
                    : JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
