import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const text = await file.text(); // read transcript content
    const formData = new FormData();
    formData.append("transcript", text);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/meeting",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Full Response from Backend:", response.data);
      setMessage(`Success: ${response.data.message}`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Meeting Transcript</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default HomePage;
