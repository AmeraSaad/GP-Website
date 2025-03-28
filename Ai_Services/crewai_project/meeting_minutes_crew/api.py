# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from main import final_minutes

app = FastAPI()

class MeetingSummary(BaseModel):
    transcript: str

@app.post("/process-summary/")
async def process_summary(summary: MeetingSummary):
    try:
        return {"meeting_minutes": final_minutes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
