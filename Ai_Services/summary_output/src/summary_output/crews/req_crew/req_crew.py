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
    api_key = os.getenv("GROQ_API_KEY1")
)

llm2 = LLM(
        model="gemini/gemini-1.5-flash",
        temperature=0.7,
        api_key="AIzaSyAwxdTXxF48JQZMJ5w5jzTfNtWOxHukync"
    )

@CrewBase
class ReqCrew:
    """Crew responsible for extracting and formatting system requirements."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def nlp_agent(self) -> Agent:
        """Agent responsible for NLP processing of meeting summaries."""
        return Agent(
            config=self.agents_config["nlp_agent"],
            llm=groq_llm_1
        )

    @agent
    def requirement_extractor_agent(self) -> Agent:
        """Agent responsible for extracting structured requirements."""
        return Agent(
            config=self.agents_config["requirement_extractor_agent"],
            llm=groq_llm_1
        )

    @agent
    def formatting_agent(self) -> Agent:
        """Agent responsible for formatting extracted requirements."""
        return Agent(
            config=self.agents_config["formatting_agent"],
            llm=groq_llm_1
        )

    @agent
    def ui_requirement_agent(self) -> Agent:
        """Agent responsible for extracting UI/UX specific requirements."""
        return Agent(
            config=self.agents_config["ui_requirement_agent"],
            llm=llm2
        )

    @task
    def nlp_task(self) -> Task:
        """Task to preprocess meeting summaries using NLP."""
        return Task(
            config=self.tasks_config["nlp_task"],
        )

    @task
    def extraction_task(self) -> Task:
        """Task to extract structured requirements."""
        return Task(
            config=self.tasks_config["extraction_task"],
        )

    @task
    def formatting_task(self) -> Task:
        """Task to format the extracted requirements."""
        return Task(
            config=self.tasks_config["formatting_task"],
        )

    @task
    def ui_extraction_task(self) -> Task:
        """Task to extract UI/UX specific requirements."""
        return Task(
            config=self.tasks_config["ui_extraction_task"],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Requirements Extraction Crew."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )