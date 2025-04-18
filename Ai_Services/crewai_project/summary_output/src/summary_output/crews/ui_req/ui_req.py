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
        model="gemini/gemini-1.5-flash",
        temperature=0.7,
        api_key= os.getenv("GEM_API_KEY3")
    )
gemini_llm2 = LLM(
        model="gemini/gemini-1.5-flash",
        temperature=0.7,
        api_key= os.getenv("GEM_API_KEY4")
    )

@CrewBase
class UIReqCrew:
    """Crew responsible for analyzing UI components and their positions."""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def page_listing_agent(self) -> Agent:
        
        return Agent(
            config=self.agents_config["page_listing_agent"],
            llm=groq_llm_1
        )

    @agent
    def component_analysis_agent(self) -> Agent:
        
        return Agent(
            config=self.agents_config["component_analysis_agent"],
            llm=gemini_llm2
        )


    @agent
    def hierarchy_analysis_agent(self) -> Agent:
        
        return Agent(
            config=self.agents_config["hierarchy_analysis_agent"],
            llm=gemini_llm
        )
    
    @agent
    def summarizer(self) -> Agent:
        
        return Agent(
            config=self.agents_config["summarizer"],
            llm=gemini_llm
        )

    

    @task
    def list_pages_task(self) -> Task:
        
        return Task(
            config=self.tasks_config["list_pages_task"],
        )

    @task
    def analyze_components_task(self) -> Task:
        
        return Task(
            config=self.tasks_config["analyze_components_task"],
        )
    
    @task
    def analyze_hierarchy_task(self) -> Task:
        
        return Task(
            config=self.tasks_config["analyze_hierarchy_task"],
        )

    @task
    def summary_task(self) -> Task:
       
        return Task(
            config=self.tasks_config["summary_task"],
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