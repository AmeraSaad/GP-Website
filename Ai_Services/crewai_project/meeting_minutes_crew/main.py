# main.py

import os
from crew import create_meeting_minutes_agent, process_transcript, merge_meeting_minutes

def read_transcript(file_path):
    """Read the transcript file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def main():
    # Determine the path to transcript.txt (assumed to be in the same folder)
    transcript_file = os.path.join(os.path.dirname(__file__), "transcript_MAN_annot09.txt")
    transcript = read_transcript(transcript_file)
    
    # Create the meeting minutes agent and crew
    agent, crew = create_meeting_minutes_agent()
    
    # Process the transcript into partial meeting minutes
    partial_minutes = process_transcript(transcript, crew, agent)
    
    # Merge the partial meeting minutes into a final document
    final_minutes = merge_meeting_minutes(partial_minutes, crew, agent)
    
    print("\nFinal Meeting Minutes:\n")
    print(final_minutes)

# if __name__ == "__main__":
#     main()
