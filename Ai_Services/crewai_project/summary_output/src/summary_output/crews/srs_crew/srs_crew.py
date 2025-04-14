from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
load_dotenv()

groq_llm_1= LLM(
    model="groq/llama-3.1-8b-instant",
    temperature=0,
    api_key = os.getenv("GROQ_API_KEY2")
)
@CrewBase
class SrsCrew:
    """Crew responsible for generating a Software Requirements Specification (SRS) document."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def srs_content_generator(self) -> Agent:
        """Agent responsible for structuring requirements into an SRS document."""
        return Agent(
            config=self.agents_config["srs_content_generator"], 
            llm=groq_llm_1
        )

    @task
    def generate_srs(self) -> Task:
        """Task to create an SRS document from extracted requirements."""
        return Task(
            config=self.tasks_config["srs_generation_task"], 
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SRS Crew that generates the structured document."""
        return Crew(
            agents=self.agents, 
            tasks=self.tasks, 
            process=Process.sequential,
            verbose=True,
        )
