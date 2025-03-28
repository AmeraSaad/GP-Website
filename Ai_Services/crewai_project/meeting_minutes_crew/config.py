# config.py
import os
from crewai import LLM

# GEM_API_KEY = os.getenv("GEM_API_KEY")

# API_KEYS = [
#     os.getenv("GROQ_API_KEY_1"),
#     os.getenv("GROQ_API_KEY_2"),
#     os.getenv("GROQ_API_KEY_3"),
#     os.getenv("GROQ_API_KEY_4"),
#     os.getenv("GROQ_API_KEY_5"),
# ]
GEM_API_KEY="AIzaSyD_Kt2fZHZw3-t0-q-DBE_9lSMczWGxOhM"

API_KEYS = [
    "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",
    "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",
    "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",
    "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",
    "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",
]

# Function to initialize an LLM instance for a given API key
def get_llm_instance(api_key):
    return LLM(
        model="groq/deepseek-r1-distill-llama-70b",
        temperature=0,
        api_key=api_key,
    )

# Gemini LLM instance
gem_llm = LLM(
    model="gemini/gemini-1.5-pro-latest",
    temperature=0,
    api_key=GEM_API_KEY
)