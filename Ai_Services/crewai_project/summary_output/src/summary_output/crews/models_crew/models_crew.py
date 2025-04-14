from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
import os
from dotenv import load_dotenv
load_dotenv()

# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

groq_llm_1= LLM(
    model="groq/gemma2-9b-it",
    temperature=0,
    api_key = os.getenv("GROQ_API_KEY3")
)
@CrewBase
class ModelsCrew:
    """Crew responsible for generating UML diagrams from extracted requirements."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def usecase_notation_extractor(self) -> Agent:
        """Agent responsible for extracting actors and use cases."""
        return Agent(
            config=self.agents_config["usecase_notation_extractor"],  
            llm=groq_llm_1
        )

    @agent
    def diagram_generator(self) -> Agent:
        """Agent responsible for generating UML Use Case diagrams."""
        return Agent(
            config=self.agents_config["diagram_generator"], 
            llm=groq_llm_1
        )

    @agent
    def diagram_enhancer(self) -> Agent:
        """Agent responsible for improving readability of UML diagrams."""
        return Agent(
            config=self.agents_config["diagram_enhancer"],  
            llm=groq_llm_1
        )

    @task
    def extract_uml_elements(self) -> Task:
        """Task to extract actors, use cases, and relationships."""
        return Task(
            config=self.tasks_config["usecase_notation_extraction_task"], 
        )

    @task
    def generate_uml_diagram(self) -> Task:
        """Task to generate the UML Use Case diagram."""
        return Task(
            config=self.tasks_config["diagram_task"],  
        )

    @task
    def enhance_diagram(self) -> Task:
        """Task to improve diagram layout and readability."""
        return Task(
            config=self.tasks_config["design"], 
        )

    @crew
    def crew(self) -> Crew:
        """Creates the UML Diagram Generation Crew."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
