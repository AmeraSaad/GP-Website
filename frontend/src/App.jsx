import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import RunWorkflow from "./pages/RunProcess";

const App = () => {
  const featuresRef = useRef(null);
  const workflowRef = useRef(null);

  const scrollToSection = (section) => {
    setTimeout(() => {
      if (section === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (section === "features" && featuresRef.current) {
        featuresRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (section === "workflow" && workflowRef.current) {
        workflowRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Small delay to ensure page load first
  };

  return (
    <Router>
      <Navbar scrollToSection={scrollToSection} />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <div ref={featuresRef}>
                  <FeatureSection />
                </div>
                <div ref={workflowRef}>
                  <Workflow />
                </div>
                <Footer />
              </>
            }
          />
          <Route path="/run-workflow" element={<RunWorkflow />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
