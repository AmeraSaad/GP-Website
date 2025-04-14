from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
load_dotenv()

@CrewBase
class SrsCrew:
    """Crew responsible for generating a Software Requirements Specification (SRS) document."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # === LLMs ===
    llm = LLM(
        model="groq/llama3-70b-8192",
        temperature=0.7,
        api_key=os.getenv("GROQ_API_KEY3"),
    )

    llm2 = LLM(
        model="gemini/gemini-1.5-pro-latest",
        temperature=0.7,
        api_key=os.getenv("GEM_API_KEY2")
    )

    # === Agents ===
    @agent
    def content_agent(self) -> Agent:
        return Agent(config=self.agents_config["content_agent"], llm=self.llm)

    @agent
    def requirements_agent(self) -> Agent:
        return Agent(config=self.agents_config["requirements_agent"], llm=self.llm)

    @agent
    def editor_agent(self) -> Agent:
        return Agent(config=self.agents_config["editor_agent"], llm=self.llm2)

    # === Tasks ===
    @task
    def content_task(self) -> Task:
        return Task(config=self.tasks_config["content_task"])

    @task
    def requirements_task(self) -> Task:
        return Task(config=self.tasks_config["requirements_task"])

    @task
    def assembly_task(self) -> Task:
        return Task(config=self.tasks_config["assembly_task"])
    
    @task
    def last_edits(self) -> Task:
        return Task(config=self.tasks_config["last_edits"])

    # === Crew ===
    @crew
    def crew(self) -> Crew:
        """Creates the SRS Crew that generates the structured document."""
        return Crew(
            agents=[
                self.content_agent(),
                self.requirements_agent(),
                self.editor_agent(),
            ],
            tasks=[
                self.content_task(),
                self.requirements_task(),
                self.assembly_task(),
                self.last_edits(),
            ],
            process=Process.sequential,
            verbose=True,
        )
