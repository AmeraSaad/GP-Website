# from meeting_output.crews.poem_crew.poem_crew import PoemCrew
#!/usr/bin/env python
from random import randint

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, or_, start

from crews.req_crew.req_crew import ReqCrew
from crews.srs_crew.srs_crew import SrsCrew
from crews.models_crew.models_crew import ModelsCrew
# from crews.ui_req.ui_req import UIReqCrew

import os
from datetime import datetime

OUTPUT_DIR = "outputs"

os.makedirs(OUTPUT_DIR, exist_ok=True)

class SystemState(BaseModel):
    meeting_summary: str = ""  # Input from the user
    extracted_requirements: str = ""
    srs_document: str = ""
    uml_diagram: str = ""
    ui_specifications: str = ""


class SystemFlow(Flow[SystemState]):

    @start()
    def extract_requirements(self):
        """Step 1: Process and extract structured requirements from the meeting summary"""
        print("🔍 Extracting requirements from meeting summary...")
        result = (
            ReqCrew()
            .crew()
            .kickoff(inputs={"meeting_summary": self.state.meeting_summary})
        )
        self.state.extracted_requirements = result.raw

    @listen(extract_requirements) 
    def generate_srs(self):
        """Step 2a: Generate a Software Requirements Specification (SRS) document"""
        print("Generating SRS document...")
        result = (
            SrsCrew()
            .crew()
            .kickoff(inputs={"requirements": self.state.extracted_requirements, "meeting_summary": self.state.meeting_summary})
        )
        self.state.srs_document = result.raw

    @listen(extract_requirements)
    def generate_uml_diagram(self):
        """Step 2b: Generate a UML Use Case Diagram from extracted requirements"""
        print("Generating UML Use Case Diagram...")
        result = (
            ModelsCrew()
            .crew()
            .kickoff(inputs={"requirements": self.state.extracted_requirements, "meeting_summary": self.state.meeting_summary})
        )
        self.state.uml_diagram = result.raw

    # @listen(extract_requirements)
    # def generate_ui_specifications(self):
    #     """Step 3: Generate UI specifications and component layouts"""
    #     print("🎨 Generating UI specifications and component layouts...")
    #     result = (
    #         UIReqCrew()
    #         .crew()
    #         .kickoff(inputs={"meeting_summary": self.state.meeting_summary, "requirements": self.state.extracted_requirements})
    #     )
    #     self.state.ui_specifications = result.raw
        # self.save_output("ui_specifications.md", self.state.ui_specifications)


def kickoff():
    # meeting_summary = input("Enter meeting summary: ")
    
    meeting_summary = ("""
        The team discussed implementing a new user authentication system.They mentioned that it should support OAuth, 
                        multi-factor authentication, and traditional username/password login.Security was a major concern,
                        and they emphasized encryption of user data.Additionally, the system must integrate with existing databases
                        and allow role-based access control.A deadline was set for the end of Q2.""")
    flow = SystemFlow()
    flow.state.meeting_summary = meeting_summary
    flow.kickoff()


def plot():
    print("Enter meeting summary: ")
    flow = SystemFlow()
    flow.plot()

# if __name__ == "__main__":
#     kickoff()
