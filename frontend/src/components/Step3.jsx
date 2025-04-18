import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { encode } from "plantuml-encoder";
import { jsPDF } from "jspdf";
import axios from "axios";

import {
  NotebookText, FileText, ListChecks, FileCog,
  LayoutDashboard, CheckCircle, ArrowLeft, Info, GitMerge, UploadCloud, ClipboardPenLine, Pen
} from "lucide-react";



const cleanPlantUmlCode = (rawCode) => {
  if (!rawCode) return '';
  let cleaned = rawCode.trim();
  cleaned = cleaned.replace(/^plantuml[\r\n]+/i, '');
  if (!cleaned.startsWith('@startuml')) {
    cleaned = `@startuml\n${cleaned}`;
  }
  if (!cleaned.endsWith('@enduml')) {
    cleaned = `${cleaned}\n@enduml`;
  }
  return cleaned;
};

const UmlRenderer = ({ umlCode }) => {
  const [error, setError] = useState(null);
  const cleanedCode = useMemo(() => {
    try {
      return cleanPlantUmlCode(umlCode);
    } catch (e) {
      setError('Failed to parse UML code');
      return '';
    }
  }, [umlCode]);

  if (!umlCode) return <div className="text-neutral-400">No UML diagram available</div>;
  if (error) return <div className="text-red-400">{error}</div>;






  return (
    <div>
      <img
        src={`https://www.plantuml.com/plantuml/svg/${encode(cleanedCode)}`}
        alt="UML Diagram"
        className="mt-4 border border-gray-600 rounded max-w-full"
        onError={() => setError('Failed to render diagram')}
      />
      <details className="mt-4 text-sm">
        <summary className="text-neutral-400 cursor-pointer">Show raw PlantUML code</summary>
        <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
          {umlCode}
        </pre>
      </details>
    </div>
  );
};

const Step3 = ({ selectedMode, uploadedFile, goBack }) => {
  console.log("step 3");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [error, setError] = useState(null);
  const [localFile, setLocalFile] = useState(null);

  const [caption, setCaption] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: "summary", name: "Meeting Summary", icon: <NotebookText size={30} />, color: "bg-yellow-400 hover:bg-yellow-600", description: "Summarize the key points of the meeting." },
    { id: "minutes", name: "Meeting Minutes", icon: <FileText size={30} />, color: "bg-blue-400 hover:bg-blue-600", description: "Generate structured meeting minutes." },
    { id: "requirements", name: "Extract Requirements", icon: <ListChecks size={30} />, color: "bg-green-400 hover:bg-green-600", description: "Identify functional and non-functional requirements from the discussion." },
    { id: "srs", name: "SRS Document", icon: <FileCog size={30} />, color: "bg-red-400 hover:bg-red-600", description: "Create a Software Requirement Specification (SRS) document." },
    { id: "uml", name: "UML Diagram", icon: <GitMerge size={30} />, color: "bg-indigo-400 hover:bg-indigo-600", description: "Generate UML diagrams based on system requirements." },
    { id: "ui", name: "UI Design", icon: <LayoutDashboard size={30} />, color: "bg-purple-400 hover:bg-purple-600", description: "Generate a UI design based on extracted requirements." },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFile(file);
    }
  };

  useEffect(() => {
    if (selectedFeature && selectedMode === 1) {
      simulateProcessing();
    } else if (selectedFeature && selectedMode === 2 && localFile) {
      simulateProcessing();
    }

    function simulateProcessing() {
      setFeatureData(null);
      setError(null);

      setTimeout(() => {
        const apiResponse = {
          id: "m001",
          summary: "Summary for Meeting 001: Discussed product roadmap and budget allocation.",
          minutes_notes: "DATE: April 10, 2025\nATTENDEES: Alice, Bob\n\n- Roadmap finalized\n- Budget split discussed",
          requirements: "**Requirements**:\n- FR-001: Roadmap management\n- FR-002: Budget tracking",
          srs: "# SRS for Meeting 001\n\n## Goals\nImprove transparency in planning.",
          uml: "@startuml\nactor Designer\nDesigner -> SprintBoard: Assign task\n@enduml",
        };

        const normalized = {
          summaryText: apiResponse.summary,
          minutes: apiResponse.minutes_notes,
          extracted_requirements: apiResponse.requirements,
          srs_document: apiResponse.srs,
          uml_diagram: apiResponse.uml
        };

        setFeatureData(normalized);
        if (selectedMode === 1) {
          setCompletedSteps(prev => [...prev, selectedFeature.id]);
        }
      }, 500);
    }
  }, [selectedFeature, localFile, selectedMode]);

  const handleStepClick = (step) => {
    if (selectedMode === 2 && localFile) return;
    setSelectedFeature(step);
    if (selectedMode === 2) {
      setLocalFile(null);
      setFeatureData(null);
    }
  };


  const handleGoBack = () => {
    if (selectedMode === 2 && selectedFeature) {
      // In Mode 2, and currently viewing feature output → go back to feature selection
      setSelectedFeature(null);
      setFeatureData(null);
      setLocalFile(null);
      setError(null);
    } else {
      // In Mode 1 OR already at selection screen in Mode 2 → go back to Step 2
      setSelectedFeature(null);
      setFeatureData(null);
      setLocalFile(null);
      setError(null);
      setTimeout(() => {
        goBack();
      }, 0);
    }
  };
  
  const handleGenerateUI = async () => {
    setLoading(true);
    setError("");
    setImagePath("");
    try {
      const res = await axios.post("/api/ui/generate-ui", { caption });
      // setImagePath(`https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24972797/Loki_CharacterSeries_Loki_v2_lg.jpeg?quality=90&strip=all&crop=19.342417061611,0,61.315165876777,100`);
      setImagePath(`http://localhost:5000${res.data.path}`);
    } catch (err) {
      setError("Failed to generate image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsPdf = async () => {
    if (!selectedFeature || !featureData) return;
  
    const pdf = new jsPDF();
  
    const textMap = {
      summary: featureData.summaryText,
      minutes: featureData.minutes,
      requirements: featureData.extracted_requirements,
      srs: featureData.srs_document,
    };
  
    if (selectedFeature.id === 'uml') {
      try {
        const svgUrl = `https://www.plantuml.com/plantuml/svg/${encode(cleanPlantUmlCode(featureData.uml_diagram))}`;
        const response = await fetch(svgUrl);
        const svgText = await response.text();
  
        // Convert SVG text to data URL (base64 PNG using canvas)
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const svgUrlObject = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
  
          const pngDataUrl = canvas.toDataURL('image/png');
          pdf.addImage(pngDataUrl, 'PNG', 10, 10, 180, 160); // Adjust width/height as needed
          pdf.save(`${selectedFeature.name}.pdf`);
          URL.revokeObjectURL(svgUrlObject);
        };
        img.src = svgUrlObject;
      } catch (err) {
        console.error("Error embedding UML diagram:", err);
        alert("Failed to export UML diagram. Try again.");
      }
    } else {
      const content = textMap[selectedFeature.id] || 'No content available.';
      const lines = pdf.splitTextToSize(content, 180);
      pdf.text(lines, 10, 10);
      pdf.save(`${selectedFeature.name}.pdf`);
    }
  };
  
  const selectedindices = [0,1,2,3,4];
  const filteredsteps = steps.filter((_,x)=>selectedindices.includes(x));

  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-4xl font-bold mb-4">
        {selectedMode === 1 ? "Processing Steps" : "Select a Specific Feature"}
      </h2>
      <p className="text-neutral-400 mb-6">
        {selectedMode === 1
          ? "Click any step to process it in any order."
          : "Choose a specific feature, then upload a file."}
      </p>

      {uploadedFile && selectedMode === 1 && (
        <p className="text-green-400 mt-2 mb-6">
          Using uploaded file: <span className="font-semibold">{uploadedFile.name}</span>
        </p>
      )}

      {selectedMode === 1 && (
        <div className="grid grid-cols-5 gap-6 w-full max-w-5xl mt-4">
          {filteredsteps.map((step) => ( 
            <div key={step.id} className="flex flex-col items-center">
              <div className="group relative">
                <button
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-full text-white font-semibold shadow-md transition-all
                    ${step.color} ${completedSteps.includes(step.id) ? "opacity-70" : "hover:opacity-100"}`}
                  onClick={() => handleStepClick(step)}
                >
                  {completedSteps.includes(step.id) ? <CheckCircle size={40} /> : step.icon}
                </button>
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-44 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                  {step.description}
                  <Info size={14} className="absolute -bottom-3 text-gray-900" />
                </div>
              </div>
              <span className="text-white mt-2 text-sm">{step.name}</span>
              {/* {completedSteps.includes(step.id) && (
                <div className="mt-3 p-3 bg-gray-800 rounded-md text-sm text-green-400 w-40">
                  ✅ Completed!
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}

      {selectedMode === 2 && !selectedFeature && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-2xl">
          {steps.map((feature) => (
            <button
              key={feature.id}
              disabled={!!localFile}
              className={`flex flex-col items-center justify-center p-6 w-48 h-32 ${feature.color} 
                ${localFile ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'} 
                rounded-xl shadow-md transition`}
              onClick={() => handleStepClick(feature)}>
              {feature.icon}
              <span className="text-white mt-2 text-center">{feature.name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedMode === 2 && selectedFeature && !localFile && !featureData && selectedFeature.id!=="ui" && (
        <div className="mt-6 flex flex-col items-center">
          <label className="flex flex-col items-center px-6 py-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
            <UploadCloud size={40} className="text-white" />

            <span className="mt-2 text-white">Upload File (Audio/Text)</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {selectedMode === 2 && selectedFeature && !localFile && !featureData && selectedFeature.id === "ui" && (
        <div className="mt-6 flex flex-col items-center">
          <label className="flex flex-col items-center px-6 py-4 bg-gray-800 rounded-lg">
            <ClipboardPenLine size={40} className="text-white" />
            <span className="mt-2 text-white">Write your UI Description</span>
            <textarea
              className="w-[650px] h-[190px] mt-4 px-4 py-2 rounded-md text-lg text-sm bg-white text-black resize"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
            <button
              onClick={handleGenerateUI}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
            >
              Generate
            </button>
          </label>
        </div>
      )}


      {/* Display Features */}
      {selectedFeature && featureData && (
          <div className="mt-6 p-6 pb-20 bg-gray-800 rounded-lg shadow-md max-w-5xl w-full h-[250px] text-left relative">
          <h3 className="text-xl font-semibold text-white mb-2">{selectedFeature.name} Processed</h3>

          {selectedFeature.id === "summary" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              <h4 className="text-white font-semibold">Summary</h4>
              <p className="whitespace-pre-wrap text-sm">{featureData.summaryText}</p>
            </div>
          )}

          {selectedFeature.id === "minutes" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              <h4 className="text-white font-semibold">Minutes</h4>
              <pre className="whitespace-pre-wrap text-sm">{featureData.minutes}</pre>
            </div>
          )}

          {selectedFeature.id === "requirements" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              <h4 className="text-white font-semibold">Extracted Requirements</h4>
              <pre className="whitespace-pre-wrap text-sm">{featureData.extracted_requirements}</pre>
            </div>
          )}

          {selectedFeature.id === "srs" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              <h4 className="text-white font-semibold mb-2">SRS Document</h4>
              <div className="prose prose-invert max-w-none text-neutral-300 bg-gray-900 p-4 rounded-md text-sm">
                <ReactMarkdown>{featureData.srs_document}</ReactMarkdown>
              </div>
            </div>
          )}


          {selectedFeature.id === "uml" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm">
              <h4 className="text-white font-semibold">UML Diagram</h4>
              <UmlRenderer umlCode={featureData.uml_diagram} />
            </div>
          )}

          {selectedFeature.id === "ui" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              <h4 className="text-white font-semibold mb-4">Generate UI Design</h4>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter UI description..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <button
                  onClick={handleGenerateUI}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-all disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                {imagePath && (
                  <div className="pt-4">
                    <h5 className="text-lg font-semibold mb-2">Generated UI:</h5>
                    <img
                      src={imagePath}
                      alt="Generated UI"
                      className="w-full rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}



          <button
            onClick={handleSaveAsPdf}
            className="absolute bottom-1.5 left-[455px] bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
          >
            Save as a PDF
          </button>
        </div>
      )}

      <button
        onClick={handleGoBack}
        className="flex items-center justify-center space-x-2 px-4 py-3 text-neutral-400 hover:text-white mt-10 transition"
      >
        <ArrowLeft size={20} />
        <span> Back</span>
      </button>
    </div>
  );
};

export default Step3;
