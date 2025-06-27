// src/pages/RunWorkflow.js
import { useState } from "react";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";

const RunWorkflow = () => {
  const [step, setStep] = useState(0); // 0: Select mode, 1: Upload/select, 2: Output
  const [selectedMode, setSelectedMode] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFeature2, setSelectedFeature2] = useState(null);

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    setStep(1); // Always go to step 1 after choosing a mode
  };

  const handleFileUpload = (file, feature = null) => {
    setUploadedFile(file);
    if (feature) setSelectedFeature2(feature); // Mode 2 case
    setStep(2); // Always show Step3 after file upload
  };

  const goBack = () => {
    if (selectedMode === 2 && step === 3) {
      // Step 3 (mode 2) → Step 2
      setStep(2);
    } else if (selectedMode === 2 && step === 2) {
      // Step 2 (mode 2) → Step 1
      setUploadedFile(null);
      setStep(1);
    } else if (step === 1) {
      // Step 1 → Step 0 (mode selection)
      setStep(0);
      setSelectedMode(null);
      setUploadedFile(null);
      setSelectedFeature2(null);
    } else if (step > 0) {
      // Generic fallback for step > 0
      setStep(step - 1);
    }
  };
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 text-white px-6">
      {step === 0 && <Step1 handleSelectMode={handleSelectMode} />}

      {step === 1 && selectedMode === 1 && (
        <Step2
          selectedMode={selectedMode}
          handleFileUpload={handleFileUpload}
          goBack={goBack}
        />
      )}

      {step === 1 && selectedMode === 2 && (
        <Step3
          selectedMode={selectedMode}
          handleFileUpload={handleFileUpload}
          goBack={goBack}
        />
      )}

      {step === 2 && (
        <Step3
          selectedMode={selectedMode}
          uploadedFile={uploadedFile}
          selectedFeature2={selectedFeature2}
          goBack={goBack}
        />
      )}
    </div>
  );
};

export default RunWorkflow;
