// src/components/UIGenerator.jsx
import React, { useState } from "react";
import { ClipboardPenLine, ArrowLeft } from "lucide-react";

const captionMap = {
  'The login page features a clean, modern interface with a centered card-style container on a soft, gradient background that transitions from light blue to white, creating a welcoming atmosphere. At the top of the container, a bold yet minimalist logo sits above a clear "Welcome Back" header and a subtle subtext encouraging users to sign in. The form includes two input fields with rounded corners and subtle drop shadows—one for the email or username and another for the password—each accompanied by intuitive icons for better usability. Below the inputs, a prominent primary button labeled "Log In" is styled with a vibrant accent color that stands out while maintaining accessibility. Additional links for "Forgot Password?" and "Create Account" are styled as underlined text, placed thoughtfully to guide users without cluttering the layout. The overall design is responsive, ensuring optimal display on both desktop and mobile devices, with smooth transitions and hover effects enhancing interactivity':
    "/ui_output/temp1.html",
  "The to-do list page has a clean and centered layout. At the top, there's a bold title like “My Tasks.” Below it, there's a single input field where users can type a task, with an “Add” button next to it. When a task is added, it appears in a list below. Each task is displayed in a row with a checkbox on the left to mark it as complete, the task name in the center, and a small delete icon or button on the right to remove it. Completed tasks are either crossed out or faded to show they’re done. The design is simple, with soft colors and clear spacing to keep everything easy to read and use.":
    "/ui_output/temp2.html",
};

export default function UIGenerator({ onBack }) {
  const [caption, setCaption] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const [error, setError] = useState("");

  const handleGenerateUI = () => {
    const trimmed = caption.trim();
    if (captionMap[trimmed]) {
      setIframeSrc(captionMap[trimmed]);
      setError("");
    } else {
      setError("No matching UI found for this description.");
      setIframeSrc("");
    }
  };

  return (
    <div className="flex flex-col items-center text-center pt-14 px-6">
      <h2 className="text-4xl font-bold mb-8">
        UI&nbsp;
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          Generator
        </span>
      </h2>
      <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl space-y-4">
        <ClipboardPenLine size={40} className="text-white" />
        <p className="text-neutral-400 mb-6 max-w-xl">
          Describe your desired UI layout, then click Generate to see a preview.
        </p>
        <textarea
          className="w-[650px] h-[190px] p-4 rounded-md bg-white text-black text-sm resize-none"
          placeholder="Enter UI description here..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          onClick={handleGenerateUI}
          className="mt-2 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
        >
          Generate
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {iframeSrc && (
        <div className="pt-8">
          <h5 className="text-lg font-semibold mb-4 text-white">
            Interactive Preview:
          </h5>
          <iframe
            src={iframeSrc}
            title="UI Preview"
            width="700px"
            height="500px"
            className="border border-neutral-700 rounded-lg"
          />
        </div>
      )}

      <div className="m-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}
