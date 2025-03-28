# config.py
import os
from crewai import LLM
from dotenv import load_dotenv

load_dotenv()

GEM_API_KEY = os.getenv("GEM_API_KEY")

API_KEYS = [
    os.getenv("GROQ_API_KEY_1"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
    os.getenv("GROQ_API_KEY_4"),
    os.getenv("GROQ_API_KEY_5"),
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