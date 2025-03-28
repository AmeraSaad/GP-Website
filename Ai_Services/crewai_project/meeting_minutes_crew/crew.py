from crewai import Agent, Task, Crew
from config import get_llm_instance, gem_llm, API_KEYS
import time

def create_meeting_minutes_agent():
    """
    Create the CrewAI agent and task for extracting meeting minutes.
    Returns:
        agent: The meeting minutes extraction agent.
        crew: The Crew instance with the agent and task.
    """
    llm_instance = get_llm_instance(API_KEYS[0])
    agent = Agent(
        name="Meeting Minutes Extractor",
        role="Meeting Analyst",
        goal="Extract structured meeting details without adding or assuming information.",
        backstory="Expert in transcribing and structuring meeting discussions.",
        allow_delegation=True,
        llm=llm_instance,
        verbose=True
    )
    
    task = Task(
       name="Extract Meeting Minutes (Strict)",
       agent=agent,
       description="Extract structured meeting minutes ONLY from the transcript Meeting Transcript:{text}. DO NOT add or assume any information.",
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
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True
    )
    return agent, crew

def process_transcript(transcript, crew, agent):
    """Split the transcript into chunks and process each chunk."""
    def chunk_text(text, max_length=5000):
        """Split large text into chunks by words, preserving meaning."""
        words = text.split()
        chunks = []
        current_chunk = ""
        for word in words:
            if len(current_chunk) + len(word) + 1 <= max_length:
                current_chunk += word + " "
            else:
                chunks.append(current_chunk.strip())
                current_chunk = word + " "
        if current_chunk:
            chunks.append(current_chunk.strip())
        return chunks

    chunks = chunk_text(transcript)
    partial_meeting_minutes = []
    num_keys = len(API_KEYS)
    
    for i, chunk in enumerate(chunks):
        # Rotate API keys in a round-robin fashion
        current_key = API_KEYS[i % num_keys]
        llm_instance = get_llm_instance(current_key)
        agent.llm = llm_instance
        
        print(f"Processing chunk {i+1}/{len(chunks)} using API key: {current_key}...")
        result = crew.kickoff(inputs={"text": chunk})
        
        if hasattr(result, "text"):
            partial_meeting_minutes.append(result.text)
        else:
            partial_meeting_minutes.append(str(result))
            
        # Short delay between processing chunks
        time.sleep(0.1)
    return partial_meeting_minutes

def merge_meeting_minutes(partial_minutes, crew, agent):
    """Merge the partial meeting minutes into a final document."""
    agent.llm = gem_llm  # Use Gemini model for merging
    
    merge_input = (
       "You are an expert meeting minutes synthesizer. The following text consists of partial meeting minutes "
       "extracted from a meeting transcript. Your task is to merge these partial outputs into a single, coherent "
       "meeting minutes document. Combine similar sections (Attendees, Discussion Points, Action Items, Next Steps), "
       "remove duplicates, and present a unified final summary of the meeting.\n\n"
       + "\n\n".join(partial_minutes)
    )
    
    merged_result = crew.kickoff(inputs={"text": merge_input})
    
    if isinstance(merged_result, str):
        return merged_result
    elif hasattr(merged_result, "text"):
        return merged_result.text
    else:
        return str(merged_result)

