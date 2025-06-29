import { useNavigate } from "react-router-dom";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleFullPipeline = () => {
    navigate("/start-automation/full");
  };

  const handleCustomFlow = () => {
    navigate("/start-automation/custom");
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        AI-Powered Meeting
        <span className="bg-gradient-to-r from-blue-500 to-purple-800 text-transparent bg-clip-text">
          {" "}
          Insights & UI Prototyping
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Revolutionize your workflow with our AI-driven platform. Automatically
        generate meeting minutes, structured SRS documents, and mid-fidelity UI
        designs—all from your discussions. Turn ideas into reality with seamless
        automation
      </p>
      <div className="flex justify-center my-10">
        <button
          onClick={handleFullPipeline}
          className="bg-gradient-to-r from-purple-500 to-blue-800 py-3 px-4 mx-3 rounded-md text-white transition duration-300 hover:scale-105 hover:shadow-lg"
        >
          Start with our Full Pipeline
        </button>
        <button
          onClick={handleCustomFlow}
          className="py-3 px-4 mx-3 rounded-md border border-white text-white transition duration-300 hover:scale-105 hover:shadow-lg"
        >
          Choose your own Flow
        </button>
      </div>

      <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video3} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroSection;
