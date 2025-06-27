# Automated Meeting Minutes and Software Design Assistant 

## Overview

This project is an end-to-end platform that leverages AI to automate the extraction of actionable insights from meeting transcripts, generate Software Requirements Specification (SRS) documents, create UML diagrams, and produce UI design suggestions. It consists of three main components:

- **Backend**: Node.js/Express server for API orchestration, data storage, and integration with AI services.
- **Frontend**: React + Vite web application for user interaction, file uploads, and visualization of outputs.
- **AI Services**: Python-based microservices (using crewAI) for advanced NLP, requirements extraction, SRS generation, UML diagramming, and UI analysis.

---

## Features

- **Automated Meeting Summaries**: Instantly generate concise summaries with key decisions and action items.
- **Meeting Minutes Generation**: Automatically create structured meeting minutes for better documentation.
- **Software Requirements Extraction**: Identify and extract functional and non-functional requirements from discussions.
- **SRS Document Generation**: Produce IEEE-compliant Software Requirements Specification documents.
- **UML Diagram Generation**: Create UML diagrams from text to visualize software architecture and workflows.
- **Smart UI Design Generation**: Convert requirements into UI layout recommendations.
- **Multilingual Support**: English and Arabic meeting processing.

---

## Project Structure

```
GP Website/
├── backend/         # Node.js/Express API server, MongoDB models, controllers, routes
├── frontend/        # React + Vite web app, Tailwind CSS, feature pages
├── Ai_Services/     # Python microservices (crewAI agents for NLP, SRS, UML, UI)
```

### Backend
- RESTful API endpoints for:
  - Uploading and processing meeting transcripts (audio/text)
  - Generating summaries, minutes, requirements, SRS, UML, and UI outputs
  - Storing and retrieving results from MongoDB
- Integrates with external AI services (AssemblyAI, FastAPI, crewAI)

### Frontend
- Modern React SPA (Single Page Application)
- Upload meeting files, select features, and view/download outputs
- Visualizes summaries, minutes, requirements, SRS, UML diagrams, and UI suggestions
- Built with Vite, Tailwind CSS, and React Router

### Ai_Services
- Python microservices using [crewAI](https://crewai.com)
- Modular agents for:
  - NLP preprocessing
  - Requirements extraction and formatting
  - SRS document assembly (IEEE 830 format)
  - UML use case diagram generation (PlantUML)
  - UI requirements and hierarchy analysis
- Configurable via YAML for agents and tasks

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (>=3.10, <3.13)
- **MongoDB** (local or cloud)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and API keys
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### AI Services Setup
```bash
cd Ai_Services/crewai_project/summary_output
# (Recommended) Use a virtual environment
pip install uv
uv pip install -r requirements.txt
# Add your API keys to .env
# Run the main pipeline
python src/summary_output/main.py
```

---

## Usage

1. **Start all services** (backend, frontend, and AI microservices).
2. **Open the frontend** in your browser (usually at http://localhost:5173).
3. **Upload a meeting transcript** (audio or text) and select the desired feature:
   - Generate summary, minutes, requirements, SRS, UML, or UI design.
4. **Download or view** the generated outputs.

---

## Customization & Extensibility
- **AI Agents**: Modify or add new agents/tasks in `Ai_Services/crewai_project/summary_output/src/summary_output/crews/`.
- **Frontend**: Customize UI/UX in `frontend/src/`.
- **Backend**: Add new API endpoints or integrations in `backend/`.

---

## License
This project is for academic and research purposes. See individual folders for more details.

---

## Acknowledgements
- [crewAI](https://crewai.com)
- [AssemblyAI](https://www.assemblyai.com/)
- [PlantUML](https://plantuml.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/) 