from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
load_dotenv()
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators


groq_llm_1= LLM(
    model="groq/llama3-8b-8192",
    temperature=0,
    api_key = os.getenv("GROQ_API_KEY4")
)

gemini_llm = LLM(
        model="gemini/gemini-1.5-pro-latest",
        temperature=0.7,
        api_key= os.getenv("GEM_API_KEY1")
    )
gemini_llm2 = LLM(
        model="gemini/gemini-1.5-pro-latest",
        temperature=0.7,
        api_key= os.getenv("GEM_API_KEY2")
    )

@CrewBase
class UIReqCrew:
    """Crew responsible for analyzing UI components and their positions."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def page_structure_agent(self) -> Agent:
        """Agent responsible for defining page structure and layout."""
        return Agent(
            config=self.agents_config["page_structure_agent"],
            llm=gemini_llm2
        )

    @agent
    def component_identification_agent(self) -> Agent:
        """Agent responsible for identifying UI components."""
        return Agent(
            config=self.agents_config["component_identification_agent"],
            llm=gemini_llm2
        )

    @agent
    def component_positioning_agent(self) -> Agent:
        """Agent responsible for defining component positions."""
        return Agent(
            config=self.agents_config["component_positioning_agent"],
            llm=gemini_llm2
        )

    @agent
    def component_relationship_agent(self) -> Agent:
        """Agent responsible for defining component relationships."""
        return Agent(
            config=self.agents_config["component_relationship_agent"],
            llm=gemini_llm
        )

    @agent
    def visual_hierarchy_agent(self) -> Agent:
        """Agent responsible for defining visual hierarchy."""
        return Agent(
            config=self.agents_config["visual_hierarchy_agent"],
            llm=gemini_llm
        )

    @task
    def page_structure_task(self) -> Task:
        """Task to define page structure and layout."""
        return Task(
            config=self.tasks_config["page_structure_task"],
        )

    @task
    def component_identification_task(self) -> Task:
        """Task to identify UI components."""
        return Task(
            config=self.tasks_config["component_identification_task"],
        )

    @task
    def component_positioning_task(self) -> Task:
        """Task to define component positions."""
        return Task(
            config=self.tasks_config["component_positioning_task"],
        )

    @task
    def component_relationship_task(self) -> Task:
        """Task to define component relationships."""
        return Task(
            config=self.tasks_config["component_relationship_task"],
        )

    @task
    def visual_hierarchy_task(self) -> Task:
        """Task to define visual hierarchy."""
        return Task(
            config=self.tasks_config["visual_hierarchy_task"],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the UI Components Analysis Crew."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )