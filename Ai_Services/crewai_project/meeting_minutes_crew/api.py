# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from crew import create_meeting_minutes_agent, process_transcript, merge_meeting_minutes

class TranscriptInput(BaseModel):
    transcript: str

app = FastAPI(
    title="Meeting Minutes API",
    description="API for processing meeting transcripts using CrewAI.",
    version="1.0"
)

@app.post("/minutes_crew")
async def process_transcript_api(input_data: TranscriptInput):
    transcript_text = input_data.transcript.strip()
    if not transcript_text:
        raise HTTPException(status_code=400, detail="Transcript is empty.")

    # Create the meeting minutes agent and crew using your crew module
    agent, crew = create_meeting_minutes_agent()

    # Process the transcript into partial meeting minutes
    partial_minutes = process_transcript(transcript_text, crew, agent)

    # Merge the partial meeting minutes into a final document
    final_minutes = merge_meeting_minutes(partial_minutes, crew, agent)

    return {"final_minutes": final_minutes}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
