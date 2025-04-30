// src/components/Step1.js
import { PlayCircle, ListChecks } from "lucide-react";

const Step1 = ({ handleSelectMode }) => {
  console.log("step 1");
  return (
    <div className="flex flex-col items-center text-center">
      {/* Title & Description */}
      <h2 className="text-4xl font-bold mb-3">
        Select Your <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">Workflow</span>
      </h2>
      <p className="text-neutral-400 mb-6">Choose whether to run the full pipeline or a specific feature.</p>

      {/* Cards Container */}
      <div className="flex flex-col space-y-6 w-full max-w-sm">
        {/* Run Full Pipeline Card */}
        <div
          onClick={() => handleSelectMode(1)}
          className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition"
        >
          <PlayCircle size={40} className="mb-3 text-blue-500" />
          <span className="text-xl font-semibold text-white">Run Full Pipeline</span>
        </div>

        {/* Choose Specific Feature Card */}
        <div
          onClick={() => handleSelectMode(2)}
          className="flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl cursor-pointer transition"
        >
          <ListChecks size={40} className="mb-3 text-blue-500" />
          <span className="text-xl font-semibold text-white">Choose a Specific Feature</span>
        </div>
      </div>
    </div>
  );
};

export default Step1;
