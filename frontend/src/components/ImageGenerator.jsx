import React, { useState } from "react";
import axios from "axios";

export default function ImageGenerator() {
  const [caption, setCaption] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImagePath("");
    try {
      const res = await axios.post("/api/ui/generate-ui", { caption });
      // const { path } = res.data;
      setImagePath(`http://localhost:5000${res.data.path}`);
    } catch (err) {
      setError("Failed to generate image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Generate UI Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter UI caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {imagePath && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <img
            src={imagePath}
            alt="Generated UI"
            className="w-full border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
