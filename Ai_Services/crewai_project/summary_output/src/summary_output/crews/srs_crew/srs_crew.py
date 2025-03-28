from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

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
