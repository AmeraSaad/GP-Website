# from meeting_output.crews.poem_crew.poem_crew import PoemCrew
#!/usr/bin/env python
from random import randint

from pydantic import BaseModel

from crewai.flow.flow import Flow, listen, or_, start

from crews.req_crew.req_crew import ReqCrew
from crews.srs_crew.srs_crew import SrsCrew
from crews.models_crew.models_crew import ModelsCrew
from crews.ui_req.ui_req import UIReqCrew

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
        # self.save_output("extracted_requirements.md", self.state.extracted_requirements)

    @listen(extract_requirements) 
    def generate_srs(self):
        """Step 2a: Generate a Software Requirements Specification (SRS) document"""
        print("Generating SRS document...")
        result = (
            SrsCrew()
            .crew()
            .kickoff(inputs={"requirements": self.state.extracted_requirements})
        )
        self.state.srs_document = result.raw
        # self.save_output("srs_document.md", self.state.srs_document)

    @listen(extract_requirements)
    def generate_uml_diagram(self):
        """Step 2b: Generate a UML Use Case Diagram from extracted requirements"""
        print("Generating UML Use Case Diagram...")
        result = (
            ModelsCrew()
            .crew()
            .kickoff(inputs={"requirements": self.state.extracted_requirements})
        )
        self.state.uml_diagram = result.raw
        # self.save_output("uml_diagram.md", self.state.uml_diagram)

    @listen(extract_requirements)
    def generate_ui_specifications(self):
        """Step 3: Generate UI specifications and component layouts"""
        print("🎨 Generating UI specifications and component layouts...")
        result = (
            UIReqCrew()
            .crew()
            .kickoff(inputs={"meeting_summary": self.state.meeting_summary, "requirements": self.state.extracted_requirements})
        )
        self.state.ui_specifications = result.raw
        # self.save_output("ui_specifications.md", self.state.ui_specifications)

    # def save_output(self, filename, content):
    #     """Overwrite output in a Markdown file"""
    #     filepath = os.path.join(OUTPUT_DIR, filename)

    #     with open(filepath, "w", encoding="utf-8") as f:
    #         f.write(f"# {filename.replace('_', ' ').title()}\n\n")
    #         f.write(content)

    #     print(f"📂 Output saved: `{filename}`")


def kickoff():
    # meeting_summary = input("Enter meeting summary: ")
    meeting_summary = ("""
        The GAMMA-J Web Store is a plug-and-play e-commerce solution designed to help small retailers quickly set up and manage online stores. 
        The system, delivered via a USB key, includes essential features such as customer account management, inventory control, shopping cart
        functionality, and secure order processing. 
        It supports multiple user roles—customers, sales personnel, and administrators—each with tailored interfaces for browsing products,
        managing inventory, and overseeing system operations. Security is a priority, with HTTPS encryption, fraud detection, and automated backups to protect sensitive data.
        The platform is built on Slackware Linux, Apache, and MySQL, ensuring compatibility with older browsers like Internet Explorer 6/7 and Netscape.

        Key strengths include high availability (99.99%), fast performance (e.g., <1s search times), and a plug-in API for future expansions. 
        However, challenges remain, such as transitioning from phone orders to the digital system and integrating advanced shipping and analytics features.
        Designed for portability and ease of use, the GAMMA-J
        Web Store provides a cost-effective, scalable solution for small businesses entering e-commerce, with room for growth through modular enhancements.
      """)
    flow = SystemFlow()
    flow.state.meeting_summary = meeting_summary
    flow.kickoff()


def plot():
    flow = SystemFlow()
    flow.plot()

# if __name__ == "__main__":
#     kickoff()


