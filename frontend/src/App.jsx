// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AutomationLanding from "./pages/AutomationPage";
import FullPipelinePage from "./pages/FullPipelinePage";
import FeaturePipelinePage from "./pages/FeaturePipelinePage";

const App = () => {
  const scrollToSection = (section) => {
    setTimeout(() => {
      if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document
          .getElementById(section)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Router>
      <Navbar scrollToSection={scrollToSection} />

      <Routes>
        <Route
          path="/"
          element={<HomePage scrollToSection={scrollToSection} />}
        />

        {/* “Start Automation” landing page */}
        <Route path="/start-automation" element={<AutomationLanding />} />

        {/* Full pipeline route */}
        <Route path="/start-automation/full" element={<FullPipelinePage />} />

        {/* Specific-feature pipeline route */}
        <Route
          path="/start-automation/custom"
          element={<FeaturePipelinePage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
