import React, { useState } from "react";
import axios from "axios";

function App() {
  const [meetingSummary, setMeetingSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState({
    extracted_requirements: "",
    srs_document: "",
    uml_diagram: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // POST to your backend endpoint
      const response = await axios.post("/api/crewai", {
        meeting_summary: meetingSummary,
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError("API responded with an error.");
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">CrewAI Meeting Processor</h1>

        <label className="block mb-2 font-medium">Meeting Summary</label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows="5"
          placeholder="Enter your meeting summary..."
          value={meetingSummary}
          onChange={(e) => setMeetingSummary(e.target.value)}
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {error && (
          <div className="text-red-500 mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!error && !loading && result.extracted_requirements && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Results</h2>

            <div className="mt-4">
              <h3 className="font-bold">Extracted Requirements</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                {result.extracted_requirements}
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">SRS Document</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                {result.srs_document}
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">UML Diagram</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
                {result.uml_diagram || "No UML Diagram returned."}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
