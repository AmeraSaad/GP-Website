from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from main import SystemFlow
from crews.req_crew.req_crew import ReqCrew
from crews.srs_crew.srs_crew import SrsCrew
from crews.models_crew.models_crew import ModelsCrew

app = FastAPI()

class MeetingSummary(BaseModel):
    meeting_summary: str

class Requirements(BaseModel):
    requirements: str

# Full Flow Execution
@app.post("/crewai-flow")
def run_crewai(summary: MeetingSummary):
    """
    API endpoint to run the CrewAI flow.
    It accepts a meeting summary, runs the flow, and returns the outputs.
    """
    try:
        flow = SystemFlow()
        flow.state.meeting_summary = summary.meeting_summary
        
        flow.state.extracted_requirements = ""
        flow.state.srs_document = ""
        flow.state.uml_diagram = ""
        # Run the CrewAI flow (synchronously)
        flow.kickoff()
        
        response = {
            "extracted_requirements": flow.state.extracted_requirements,
            "srs_document": flow.state.srs_document,
            "uml_diagram": flow.state.uml_diagram,
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Individual Crew Execution
@app.post("/crewai-req")
def extract_requirements(summary: MeetingSummary):
    """Runs only the ReqCrew to extract requirements"""
    try:
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
        req_result = ReqCrew().crew().kickoff(inputs={"meeting_summary": summary.meeting_summary})
        extracted_requirements = req_result.raw

        srs_result = SrsCrew().crew().kickoff(inputs={"requirements": extracted_requirements})

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
        req_result = ReqCrew().crew().kickoff(inputs={"meeting_summary": summary.meeting_summary})
        extracted_requirements = req_result.raw

        uml_result = ModelsCrew().crew().kickoff(inputs={"requirements": extracted_requirements})

        return {
            "extracted_requirements": extracted_requirements,
            "uml_diagram": uml_result.raw
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))