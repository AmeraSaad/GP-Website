from crewai import Agent, Task, Crew
from config import get_llm_instance, API_KEYS

# Define agent for extracting meeting minutes
meeting_minutes_extractor = Agent(
    name="Meeting Minutes Extractor",
    role="Meeting Analyst",
    goal="Extract structured meeting details without adding or assuming information.",
    backstory="Expert in transcribing and structuring meeting discussions.",
    allow_delegation=True,
    llm=get_llm_instance(API_KEYS[0]),  # Start with the first API key
    verbose=True
)

# Define task for the agent
meeting_minutes_task = Task(
    name="Extract Meeting Minutes (Strict)",
    agent=meeting_minutes_extractor,
    description="Extract structured meeting minutes ONLY from the transcript. DO NOT add or assume any information.",
    prompt_template=(
        "You are an expert meeting minutes extractor. Given the following meeting transcript, extract structured meeting minutes "
        "by following these rules:\n\n"
        "*Rules:*\n"
        "1. Do NOT invent names, dates, or details. Extract ONLY from the transcript.\n"
        "2. If a detail is missing, write 'Not Mentioned'.\n"
        "3. Maintain original wording from the transcript wherever possible.\n\n"
        "*Extracted Meeting Minutes:*\n"
        "Organisation: {Extract or 'Not Mentioned'}\n"
        "Meeting Name: {Extract or 'Not Mentioned'}\n"
        "Meeting Date: {Extract or 'Not Mentioned'}\n"
        "Meeting Topic: {Extract or 'Not Mentioned'}\n"
        "Meeting Participants: {Extract all mentioned names}\n"
        "Moderator: {Extract or 'Not Mentioned'}\n"
        "Purpose: {Extract or 'Not Mentioned'}\n"
        "Key Priorities: {List or 'Not Mentioned'}\n"
        "Deadlines: {Extract or 'Not Mentioned'}\n"
        "Decisions: {Extract or 'Not Mentioned'}\n"
        "Actions & Responsibilities: {Extract or 'Not Mentioned'}\n"
        "Meeting Outcomes: {Extract or 'Not Mentioned'}\n"
        "Minutes Submitted By: {Extract or 'Not Mentioned'}\n"
    ),
    expected_output="Structured meeting minutes with accurate extracted details.",
    verbose=True
)

# Create the Crew instance
meeting_minutes_crew = Crew(
    agents=[meeting_minutes_extractor],
    tasks=[meeting_minutes_task],
    verbose=True
)
