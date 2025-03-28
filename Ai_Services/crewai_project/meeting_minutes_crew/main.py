import time
from config import get_llm_instance, gem_llm, API_KEYS
from crew import meeting_minutes_crew
import os

# Function to read transcript from a file
def read_transcript(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

# Function to split text into smaller chunks while preserving meaning
def chunk_text(text, max_length=5000):
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

if __name__ == "__main__":
    # Set the file path for the transcript
    file_path = "transcript_MAN_annot09.txt"

    # Read the transcript
    if os.path.exists(file_path):
        transcript = read_transcript(file_path)
    else:
        print(f"Error: {file_path} not found.")
        exit(1)

    # Split transcript into chunks
    chunks = chunk_text(transcript)

    partial_meeting_minutes = []
    num_keys = len(API_KEYS)

    # Process each chunk using round-robin API key selection
    for i, chunk in enumerate(chunks):
        current_key = API_KEYS[i % num_keys]
        llm_instance = get_llm_instance(current_key)

        # Update agent LLM instance
        meeting_minutes_crew.agents[0].llm = llm_instance

        print(f"Processing chunk {i+1}/{len(chunks)} using API key: {current_key}...")
        result = meeting_minutes_crew.kickoff(inputs={"text": chunk})

        # Ensure we capture text from the result
        if hasattr(result, "text"):
            partial_meeting_minutes.append(result.text)
        else:
            partial_meeting_minutes.append(str(result))

        # Optional delay
        time.sleep(0.1)

    # Merge extracted meeting minutes
    meeting_minutes_crew.agents[0].llm = gem_llm

    merge_input = (
        "You are an expert meeting minutes synthesizer. The following text consists of partial meeting minutes "
        "extracted from a meeting transcript. Your task is to merge these partial outputs into a single, coherent "
        "meeting minutes document. Combine similar sections, remove duplicates, and present a unified summary.\n\n"
        + "\n\n".join(partial_meeting_minutes)
    )

    merged_meeting_minutes = meeting_minutes_crew.kickoff(inputs={"text": merge_input})

    # Extract final text from result
    if isinstance(merged_meeting_minutes, str):
        final_minutes = merged_meeting_minutes
    elif hasattr(merged_meeting_minutes, "text"):
        final_minutes = merged_meeting_minutes.text
    else:
        final_minutes = str(merged_meeting_minutes)

    # Print final meeting minutes
    print("\nFinal Meeting Minutes:\n")
    print(final_minutes)
