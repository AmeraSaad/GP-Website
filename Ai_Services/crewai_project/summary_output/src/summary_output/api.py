from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from main import SystemFlow
from crews.req_crew.req_crew import ReqCrew
from crews.srs_crew.srs_crew import SrsCrew
from crews.models_crew.models_crew import ModelsCrew

app = FastAPI()

class MeetingSummary(BaseModel):
    meeting_summary: str

# Full Flow Execution
@app.post("/crewai-flow")
def run_crewai(summary: MeetingSummary):
    try:
        flow = SystemFlow()
        flow.state.meeting_summary = summary.meeting_summary
        flow.state.extracted_requirements = ""
        flow.state.srs_document = ""
        flow.state.uml_diagram = ""
        flow.state.ui_specifications = ""
        flow.kickoff()
        return {
            "extracted_requirements": flow.state.extracted_requirements,
            "srs_document": flow.state.srs_document,
            "uml_diagram": flow.state.uml_diagram,
            "ui_specifications": flow.state.ui_specifications
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Individual Crew Execution
@app.post("/crewai-req")
def extract_requirements(summary: MeetingSummary):
    try:
        print("DEBUG summary:", summary.meeting_summary)
        result = ReqCrew().crew().kickoff(inputs={"meeting_summary": summary.meeting_summary})
        return {"extracted_requirements": result.raw}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/crewai-srs")
def generate_srs(summary: MeetingSummary):
    """
    extract requirements, then generate an SRS document.
    """
    try:
        # 1. Extract requirements from summary
        req_result = ReqCrew().crew().kickoff(inputs={
            "meeting_summary": summary.meeting_summary
        })
        extracted_requirements = req_result.raw

        # 2. Generate SRS using both summary and extracted requirements
        srs_result = SrsCrew().crew().kickoff(inputs={
            "meeting_summary": summary.meeting_summary,
            "requirements": extracted_requirements
        })

        return {
            "extracted_requirements": extracted_requirements,
            "srs_document": srs_result.raw
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/crewai-uml")
def generate_uml(summary: MeetingSummary):
    """
    extract requirements, then generate a UML diagram.
    """
    try:
        # 1. Extract requirements from summary
        req_result = ReqCrew().crew().kickoff(inputs={
            "meeting_summary": summary.meeting_summary
        })
        extracted_requirements = req_result.raw

        # 2. Generate UML using both summary and extracted requirements
        uml_result = ModelsCrew().crew().kickoff(inputs={
            "meeting_summary": summary.meeting_summary,
            "requirements": extracted_requirements
        })

        return {"uml_diagram": uml_result.raw}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
