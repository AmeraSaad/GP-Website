import React, { useState } from "react";

export default function UIRenderer() {
  const [caption, setCaption] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [error, setError] = useState("");

  const captionMap = {
    'The login page features a clean, modern interface with a centered card-style container on a soft, gradient background that transitions from light blue to white, creating a welcoming atmosphere. At the top of the container, a bold yet minimalist logo sits above a clear "Welcome Back" header and a subtle subtext encouraging users to sign in. The form includes two input fields with rounded corners and subtle drop shadows—one for the email or username and another for the password—each accompanied by intuitive icons for better usability. Below the inputs, a prominent primary button labeled "Log In" is styled with a vibrant accent color that stands out while maintaining accessibility. Additional links for "Forgot Password?" and "Create Account" are styled as underlined text, placed thoughtfully to guide users without cluttering the layout. The overall design is responsive, ensuring optimal display on both desktop and mobile devices, with smooth transitions and hover effects enhancing interactivity':
      "/ui_output/temp1.html",

    "The to-do list page has a clean and centered layout. At the top, there's a bold title like “My Tasks.” Below it, there's a single input field where users can type a task, with an “Add” button next to it. When a task is added, it appears in a list below. Each task is displayed in a row with a checkbox on the left to mark it as complete, the task name in the center, and a small delete icon or button on the right to remove it. Completed tasks are either crossed out or faded to show they’re done. The design is simple, with soft colors and clear spacing to keep everything easy to read and use.":
      "/ui_output/temp2.html",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedSrc = captionMap[caption.trim()];
    if (matchedSrc) {
      setIframeSrc(matchedSrc);
      setShowIframe(true);
      setError("");
    } else {
      setError("No matching UI found for this caption.");
      setShowIframe(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">View Interactive UI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={6}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter UI caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          View UI
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {showIframe && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Interactive Preview:</h2>
          <iframe
            src={iframeSrc}
            title="UI Preview"
            width="100%"
            height="600px"
            className="border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
