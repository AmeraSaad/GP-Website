import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { encode } from "plantuml-encoder";
import { jsPDF } from "jspdf";
import axios from "axios";


import {
  NotebookText, FileText, ListChecks, FileCog,
  LayoutDashboard, CheckCircle, ArrowLeft, Info, GitMerge, UploadCloud, ClipboardPenLine, Pen
} from "lucide-react";



const cleanPlantUmlCode = (rawCode) => {
  if (!rawCode) return '';
  let cleaned = rawCode.trim();
  cleaned = cleaned.replace(/^plantuml[\r\n]+/i, '');
  if (!cleaned.startsWith('@startuml')) {
    cleaned = `@startuml\n${cleaned}`;
  }
  if (!cleaned.endsWith('@enduml')) {
    cleaned = `${cleaned}\n@enduml`;
  }
  return cleaned;
};

const UmlRenderer = ({ umlCode }) => {
  const [error, setError] = useState(null);
  const cleanedCode = useMemo(() => {
    try {
      return cleanPlantUmlCode(umlCode);
    } catch (e) {
      setError('Failed to parse UML code');
      return '';
    }
  }, [umlCode]);

  if (!umlCode) return <div className="text-neutral-400">No UML diagram available</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <img
        src={`https://www.plantuml.com/plantuml/svg/${encode(cleanedCode)}`}
        alt="UML Diagram"
        className="mt-4 border border-gray-600 rounded max-w-full"
        onError={() => setError('Failed to render diagram')}
      />
      <details className="mt-4 text-sm">
        <summary className="text-neutral-400 cursor-pointer">Show raw PlantUML code</summary>
        <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
          {umlCode}
        </pre>
      </details>
    </div>
  );
};

const Step3 = ({ selectedMode, uploadedFile, goBack }) => {
  console.log("step 3");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [featureData2, setFeatureData2] = useState(null);    
  const [error, setError] = useState(null);
  const [localFile, setLocalFile] = useState(null);

  const [caption, setCaption] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: "summary", name: "Meeting Summary", icon: <NotebookText size={30} />, color: "bg-yellow-400 hover:bg-yellow-600", description: "Summarize the key points of the meeting." },
    { id: "minutes", name: "Meeting Minutes", icon: <FileText size={30} />, color: "bg-blue-400 hover:bg-blue-600", description: "Generate structured meeting minutes." },
    { id: "requirements", name: "Extract Requirements", icon: <ListChecks size={30} />, color: "bg-green-400 hover:bg-green-600", description: "Identify functional and non-functional requirements from the discussion." },
    { id: "srs", name: "SRS Document", icon: <FileCog size={30} />, color: "bg-red-400 hover:bg-red-600", description: "Create a Software Requirement Specification (SRS) document." },
    { id: "uml", name: "UML Diagram", icon: <GitMerge size={30} />, color: "bg-indigo-400 hover:bg-indigo-600", description: "Generate UML diagrams based on system requirements." },
    { id: "ui", name: "UI Design", icon: <LayoutDashboard size={30} />, color: "bg-purple-400 hover:bg-purple-600", description: "Generate a UI design based on extracted requirements." },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFile(file);
    }
  };
  useEffect(() => {
    if (selectedFeature) {
        simulateProcessing();
    }

    function simulateProcessing() {
        setFeatureData(null);
        setError(null);
        const mode = selectedMode;
        const delay = mode === 1 ? 4 * 60 * 1000 : 15 * 1000; // 4 mins or 15 sec
      
        setTimeout(() => {
          const apiResponse = {
            id: "m001",
            summary:
                "Gamma JI Web Store project aims to create a plug and play USB based webstore platform that is easy to use as plugging in a mouse. It's aimed at small to mid sized businesses that don't want to depend on Shopify or BigCommerce. It will run on Yalgi's USB platform with an exascale PSA270 chipset. The target hardware environment is Intel based systems minimum 128ebstorm4GB flash storage. There will be at least 2 admins per store for redundancy. Speaker A, B, C, D, E, F, and G are looking for an i18 in ready architecture, basic metrics, views per product, conversion rates, cart abandonment, sales per day, week, month, csev, real time alerts and dashboards. Speaker B wants to integrate a gateway, maybe stripe or a dummy system, future PCI compliance is on the table. Speaker E wants to support multiple currencies and subcategories with drag and drop reordering. Speaker A, B, C, D, E, F and G are working on a new website for their company. They want to improve performance, error messages, color coded notifications, clear messaging help bubbles, offline browsing with cache for common pages, responsive design and a kiosk mode for physical shops are on their wish list. Speaker A, B, C, D, E, F and G attended the second requirements elicitation meeting. They discussed the development of the software requirements specification for the new system. They want to monitor the transition from phone orders to online ones. Speaker A will develop user manuals and training videos tailored to each user role. Speaker A, Rally Karim, Speaker B, Speaker C, Speaker D, Speaker F and Speaker A discuss the data validation and security measures for the new website. Speaker C explains the security measures. Speaker A, Linda and Speaker B discuss the key user flows and accessibility considerations. Speaker E, Speaker A, Speaker B, Speaker C, Speaker D, Speaker E and Speaker F are discussing the design of Puppy's website. They discuss scalability, performance, infrastructure, training, and browser compatibility. They also discuss the deployment and update strategy. BSRS will create a detailed data migration plan for the new system. They will provide ongoing support through a help desk and online knowledge base. The SRS document v0.2 will be updated to reflect today's discussions and will provide a timeline for the next phase.",
            minutes_notes:
                `DATE: April 19, 2025
            ATTENDEES: Speaker A, Speaker B, Speaker C, Speaker D, Speaker E, Speaker F


            SUMMARY
            - Gamma JI Web Store project aims to create a plug and play USB based webstore platform that is easy to use as plugging in a mouse.
            - It's aimed at small to mid sized businesses that don't want to depend on Shopify or BigCommerce.
            - It will run on Yalgi's USB platform with an exascale PSA270 chipset.
            - The target hardware environment is Intel based systems minimum 128ebstorm4GB flash storage.
            - There will be at least 2 admins per store for redundancy.
            - Speaker A, B, C, D, E, F, and G are looking for an i18 in ready architecture, basic metrics, views per product, conversion rates, cart abandonment, sales per day, week, month, csev, real time alerts and dashboards.
            - Speaker B wants to integrate a gateway, maybe stripe or a dummy system, future PCI compliance is on the table.
            - Speaker E wants to support multiple currencies and subcategories with drag and drop reordering.
            - Speaker A, B, C, D, E, F and G are working on a new website for their company.
            - They want to improve performance, error messages, color coded notifications, clear messaging help bubbles, offline browsing with cache for common pages, responsive design and a kiosk mode for physical shops are on their wish list.
            - Speaker A, B, C, D, E, F and G attended the second requirements elicitation meeting.
            - They discussed the development of the software requirements specification for the new system.
            - They want to monitor the transition from phone orders to online ones.
            - Speaker A will develop user manuals and training videos tailored to each user role.
            - Speaker A, Rally Karim, Speaker B, Speaker C, Speaker D, Speaker F and Speaker A discuss the data validation and security measures for the new website.
            - Speaker C explains the security measures.
            - Speaker A, Linda and Speaker B discuss the key user flows and accessibility considerations.
            - Speaker E, Speaker A, Speaker B, Speaker C, Speaker D, Speaker E and Speaker F are discussing the design of Puppy's website.
            - They discuss scalability, performance, infrastructure, training, and browser compatibility.
            - They also discuss the deployment and update strategy.
            - BSRS will create a detailed data migration plan for the new system.
            - They will provide ongoing support through a help desk and online knowledge base.
            - The SRS document v0.2 will be updated to reflect today's discussions and will provide a timeline for the next phase.


            Minuted by: VOCAMIND `,
            requirements:
                "UI/UX Requirements:\n\n**1. Interface Components:**\n\n* **User Profile Page:**  A form for creating and managing user profiles, including fields for name, email, password, and potentially profile picture, bio, and other relevant information.  The form should include clear labels and input validation.\n* **Search Bar:** A search bar prominently displayed to allow users to search for other users based on shared interests and preferences (e.g., keywords, tags).  The search results should be displayed in a clear and easily navigable format.\n* **Dashboard:** A personalized dashboard displaying the user's connections, recent activity feed (e.g., new posts, comments, connection requests), and potentially notifications.  This should be visually appealing and easily scannable.\n* **Post Creation Form:** A form for creating posts, including options for text input, image/video uploads, and potentially other media types.  Clear instructions and character limits should be provided.\n* **Comment Section:** A section below each post to allow users to comment.  It should clearly display comments and allow for easy reply functionality.  The display of comments should be chronological and easy to follow.\n* **Connection Management:** A section or page displaying the user's connections, allowing for actions like adding, removing, and viewing connection profiles.\n* **Navigation Menu:**  A clear and intuitive navigation menu (e.g., hamburger menu, tabs) allowing users to easily access different sections of the application (profile, search, dashboard, settings, etc.).\n\n**2. User Flows:**\n\n* **User Registration/Login:** A straightforward registration and login flow with clear instructions and feedback mechanisms.  This should include options for password recovery.\n* **Profile Creation/Editing:**  A smooth flow for creating and editing user profiles.  The system should provide clear feedback on successful updates.\n* **User Search:**  A user-friendly search flow that provides relevant results quickly.  The system should handle various search queries and provide filtering options if necessary.\n* **Connection Management:** A simple and intuitive flow for adding, removing, and managing connections.\n* **Post Creation and Sharing:** A user-friendly flow for creating and sharing posts, including options for media uploads and tagging.\n* **Comment and Engagement:**  A clear flow for commenting on posts and engaging with other users.  The system should handle nested replies and notifications.\n\n**3. Visual Design:**\n\n* **Consistent Branding:**  Maintain a consistent brand identity throughout the application, including color scheme, typography, and imagery.\n* **Intuitive Layout:**  Use a clear and intuitive layout to guide users through the application.  Prioritize important information and use visual hierarchy effectively.\n* **Visually Appealing Design:**  The design should be visually appealing and engaging, using high-quality imagery and appropriate visual elements.\n* **Clear Typography:**  Use legible fonts and appropriate font sizes for different elements.  Ensure good contrast between text and background.\n\n\n**4. Accessibility:**\n\n* **Screen Reader Compatibility:**  Ensure the application is compatible with screen readers and other assistive technologies.  Provide alternative text for images and other non-text elements.\n* **Keyboard Navigation:**  Allow users to navigate the application using only a keyboard.\n* **Color Contrast:**  Maintain sufficient color contrast between text and background to ensure readability for users with visual impairments.\n* **Alternative Input Methods:** Consider support for alternative input methods such as voice input.\n\n\n**5. Responsive Design:**\n\n* **Adaptive Layout:**  The application should adapt seamlessly to different screen sizes and devices (desktops, tablets, smartphones).\n* **Optimized for Mobile:**  The application should be optimized for mobile devices, ensuring optimal usability and performance.\n\n\n**6. User Interaction:**\n\n* **Clear Feedback Mechanisms:**  Provide clear and timely feedback to users on their actions.\n* **Error Handling:**  Handle errors gracefully and provide informative error messages to users.\n* **Intuitive Controls:**  Use intuitive controls and interactions that are easy to understand and use.\n* **Progress Indicators:**  Provide visual progress indicators for long-running tasks.\n\n\nThis detailed breakdown provides a comprehensive set of UI/UX requirements based on the provided functional and non-functional requirements.  Further refinement will depend on user research and prototyping.",
            srs:
                "# Software Requirements Specification (SRS) for Social Networking Application\n\n**1. Introduction**\n\n**1.1 Purpose**\n\nThis document outlines the software requirements for a new social networking application. It serves as a guide for developers, testers, and stakeholders throughout the software development lifecycle. It details the functional and non-functional requirements necessary to build a successful and user-friendly application.\n\n**1.2 Document Conventions**\n\n*   **Acronyms:** SRS (Software Requirements Specification), UI (User Interface), UX (User Experience), API (Application Programming Interface), SQL (Structured Query Language), GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), WCAG (Web Content Accessibility Guidelines)\n*   **Formatting:** This document uses Markdown formatting. Requirements are presented using numbered lists and tables where appropriate.  UML diagrams may be included in future iterations.\n\n**1.3 Intended Audience and Reading Suggestions**\n\nThis document is intended for:\n\n*   **Developers:** To understand the detailed functional and non-functional requirements for implementation.\n*   **Testers:** To define test cases and acceptance criteria.\n*   **Stakeholders:** To gain a high-level understanding of the project scope and objectives.\n\nDevelopers should read the entire document, paying close attention to section 3 (System Features and Requirements). Testers should focus on sections 3 and the specific acceptance criteria within each requirement. Stakeholders should review sections 1 and 2 for a general overview.\n\n**1.4 Product Scope**\n\nThis document specifies the requirements for a social networking application that allows users to connect, share posts, and engage with each other. Key features include user profile management, search functionality, a personalized dashboard, post creation and sharing, comment and engagement features, and connection management. The application aims to provide a user-friendly and engaging platform for social interaction.\n\n\n**2. Overall Description**\n\n**2.1 Product Perspective**\n\nThis social networking application will operate as a standalone web application accessible through modern web browsers. It will not directly interact with other systems initially, but future iterations may include integration with third-party authentication providers (e.g., Google, Facebook, OAuth 2.0).\n\n**2.2 Product Features**\n\nKey functionalities include:\n\n*   User Profile Management\n*   Search Functionality\n*   Personalized Dashboard\n*   Post Creation and Sharing\n*   Comment and Engagement\n*   Connection Management\n*   Intuitive Navigation\n*   Notification System\n\n**2.3 User Classes and Characteristics**\n\nThe application will cater to the following user classes:\n\n*   **Registered Users:** Can create profiles, post, comment, manage connections, and receive notifications.\n*   **Guests:** Limited access, primarily for browsing public content (future implementation).  May require registration for certain features.\n*   **Administrators:** Access to system administration tools (future implementation).  Can manage user accounts, content moderation, and system settings.\n\n\n**2.4 Operating Environment**\n\n*   **Hardware:** Modern desktop computers, tablets, and smartphones.\n*   **Software:** Modern web browsers (Chrome, Firefox, Safari, Edge), supporting JavaScript and HTML5.\n*   **Network:** Reliable internet connection required.  Minimum bandwidth requirements to be specified in a separate document.\n*   **Platforms:** Web-based application (responsive design for various screen sizes).  Target platforms include iOS and Android for mobile app versions (future implementation).\n*   **Database:**  A relational database (e.g., PostgreSQL, MySQL) will be used to store user data and application content.  Specific database technology to be defined in the system design document.\n\n\n**2.5 Design and Implementation Constraints**\n\n*   The application should be developed using a modern technology stack (specific technologies to be defined in a separate document).  This will include a consideration of scalability and maintainability.\n*   The application must comply with relevant data privacy regulations (e.g., GDPR, CCPA).  A Data Protection Impact Assessment (DPIA) will be conducted.\n*   Security best practices must be followed throughout the development process, including regular security audits and penetration testing.\n*   The application should be designed for internationalization and localization to support multiple languages and regions (future implementation).\n\n**2.6 User Documentation**\n\nUser documentation will include:\n\n*   A comprehensive user guide covering all application features.\n*   Context-sensitive help within the application.\n*   Short video tutorials demonstrating key functionalities.\n*   FAQ section addressing common user questions.\n\n**2.7 Assumptions and Dependencies**\n\n*   The application assumes the availability of a reliable internet connection for users.\n*   The application may depend on third-party libraries for certain functionalities (to be specified).  These dependencies will be documented and managed carefully.\n*   The application assumes the availability of a suitable hosting environment with sufficient resources to meet performance requirements.\n\n\n**3. System Features and Requirements**\n\n**3.1 Functional Requirements**\n\n| Requirement ID | Description | Priority | Input/Process/Output | Acceptance Criteria |\n|---|---|---|---|---|\n| FR-001 | User Profile Management: Create and manage user profiles (name, email, password, profile picture, bio). | High | User Input (Profile Data) → System Processes (Validation, Storage) → System Output (Profile Page, Success/Error Messages) | Profile creation and update functionality is available.  Data validation ensures correct data types and formats.  Error messages are clear and informative. |\n| FR-002 | User Profile Management: Update user profile information. | High | User Input (Updated Profile Data) → System Processes (Validation, Update) → System Output (Updated Profile Page, Success/Error Messages) | Users can successfully update their profile information.  Changes are reflected immediately.  Error handling is robust. |\n| FR-003 | Search Functionality: Search for users based on criteria (interests, preferences, keywords). | High | User Input (Search Query) → System Processes (Search Algorithm) → System Output (Search Results) | Search results are relevant and displayed in a user-friendly manner.  Search functionality supports partial matches and multiple keywords. |\n| FR-004 | Dashboard: Display personalized dashboard with connections, activity feed, and notifications. | High | System Processes (Data Retrieval) → System Output (Dashboard) | The dashboard displays recent activity, connections, and unread notifications.  Information is updated in real-time or near real-time. |\n| FR-005 | Post Creation: Create and share posts (text, images, videos). | High | User Input (Post Content) → System Processes (Validation, Storage, Sharing) → System Output (Posted Content, Success/Error Messages) | Users can create posts with various media types.  Posts are shared with selected connections.  File upload sizes are limited. |\n| FR-006 | Comment and Engagement: Comment on posts and reply to comments. | High | User Input (Comment Text) → System Processes (Validation, Storage, Notification) → System Output (Updated Comment Section) | Users can comment and reply to comments on posts.  Comments are displayed chronologically.  Nested replies are supported. |\n| FR-007 | Connection Management: Add, remove, and view connections. | High | User Input (Connection Actions) → System Processes (Connection Management) → System Output (Updated Connection List) | Users can manage their connections effectively.  Connection requests are handled appropriately.  Connection status is clearly indicated. |\n| FR-008 | Navigation: Provide clear and intuitive navigation throughout the application. | High | System Processes (Navigation Structure) → System Output (Navigation Menu) | Navigation is consistent across all pages.  Menu is easily accessible.  Users can quickly navigate to different sections of the application. |\n| FR-009 | Notification System: Users receive notifications for new connections, comments, and mentions. | Medium | System Processes (Notification Generation) → System Output (Notifications) | Notifications are delivered promptly and clearly indicate the type of event.  Users can manage notification preferences. |\n\n\n**3.2 External Interface Requirements**\n\n*   **User Interfaces:**  Web-based interface, responsive design.\n*   **Hardware Interfaces:**  None initially.\n*   **Software Interfaces:**  Modern web browsers, potentially third-party authentication services (future implementation).\n*   **Communications Interfaces:**  HTTPS for secure communication.\n\n**3.3 Non-Functional Requirements**\n\n**3.3.1 Performance Requirements**\n\n*   Response time to user input: ≤ 2 seconds.\n*   Concurrent users: Minimum 1000 (scalable to higher numbers).\n*   Average page load time: ≤ 3 seconds.\n*   API response time: ≤ 1 second.\n\n**3.3.2 Security Requirements**\n\n*   Password encryption using bcrypt or a comparable strong hashing algorithm.\n*   Input validation to prevent SQL injection, cross-site scripting (XSS), and other common web vulnerabilities.  OWASP Top 10 vulnerabilities to be addressed.\n*   Secure protocols (HTTPS) for all data transmission.\n*   Regular security audits and penetration testing.\n*   Implementation of appropriate authentication and authorization mechanisms.\n*   Data encryption at rest and in transit.\n\n**3.3.3 Reliability & Availability**\n\n*   Target uptime: 99.99%.\n*   Regular backups and disaster recovery plan.  Automated backup and recovery mechanisms will be implemented.\n*   Error handling and logging mechanisms to ensure system stability and facilitate debugging.\n\n**3.3.4 Maintainability**\n\n*   Well-documented codebase using version control (e.g., Git).\n*   Modular design for easy maintenance and updates.\n*   Use of design patterns and best practices to improve code quality and maintainability.\n\n**3.3.5 Portability**\n\n*   Responsive design for cross-platform compatibility (desktops, tablets, smartphones).\n*   Code should be written in a platform-agnostic manner to facilitate future porting to other platforms.\n\n**3.3.6 Usability**\n\n*   Clear and intuitive user interface following established UX best practices.\n*   Informative and user-friendly error messages.\n*   Visually appealing design that is consistent with branding guidelines.\n*   User testing and feedback incorporated throughout the development process.\n\n**3.3.7 Accessibility**\n\n*   Compliance with WCAG 2.1 AA guidelines.\n*   Screen reader compatibility.\n*   Sufficient color contrast.\n*   Keyboard navigation support.\n*   Alternative text for images and other non-text elements.\n\n**3.3.8 Scalability**\n\n*   The system architecture should be designed to handle a growing number of users and data.\n*   Load balancing and horizontal scaling techniques should be employed.\n*   Database optimization and caching strategies should be implemented.\n\n\n**4. Conclusion**\n\nThis SRS document provides a comprehensive overview of the requirements for the social networking application. Further details and specifications will be elaborated in subsequent design and implementation documents. This document will be updated as the project progresses and requirements evolve.",
            uml:
            `@startuml
              left to right direction
              skinparam packageStyle rectangle

              actor Customer
              actor Administrator
              actor "System Administrator" as SysAdmin

              rectangle "E-Commerce System" {
                  
                  package "Shopping" {
                      Customer --> (Browse Products)
                      Customer --> (Add Products to Cart)
                      Customer --> (Manage Shopping Cart)
                      Customer --> (Checkout)
                  }

                  package "Account & Orders" {
                      Customer --> (Manage Account)
                      Customer --> (View Order Status)
                      Customer --> (Provide Feedback)
                  }

                  package "Admin Dashboard" {
                      Administrator --> (Manage Products)
                      Administrator --> (Process Orders)
                      Administrator --> (Manage Inventory)
                      Administrator --> (Manage Users)
                      Administrator --> (Monitor Key Metrics)
                      Administrator --> (Configure System Settings)
                      Administrator --> (Generate Reports)
                      Administrator --> (Manage Payment Gateways)
                      Administrator --> (Update Website Content)
                      Administrator --> (Troubleshoot Issues)
                  }

                  package "System Maintenance" {
                      SysAdmin --> (System Maintenance)
                      SysAdmin --> (Security Management)
                      SysAdmin --> (Performance Monitoring)
                      SysAdmin --> (User Access Control)
                      SysAdmin --> (Data Backup & Recovery)
                  }

                  ' Optional relationships
                  (Checkout) ..> (Manage Shopping Cart) : includes
                  (Checkout) ..> (Manage Account) : includes
                  (Provide Feedback) ..> (View Order Status) : extends
              }

              @enduml`,

        };

            const dummyMode2Data = {
              id: "m002",
              summary:
                  "Gamma JI Web Store project aims to create a plug and play USB based webstore platform that is easy to use as plugging in a mouse. It's aimed at small to mid sized businesses that don't want to depend on Shopify or BigCommerce. It will run on Yalgi's USB platform with an exascale PSA270 chipset. The target hardware environment is Intel based systems minimum 128ebstorm4GB flash storage. There will be at least 2 admins per store for redundancy. Speaker A, B, C, D, E, F, and G are looking for an i18 in ready architecture, basic metrics, views per product, conversion rates, cart abandonment, sales per day, week, month, csev, real time alerts and dashboards. Speaker B wants to integrate a gateway, maybe stripe or a dummy system, future PCI compliance is on the table. Speaker E wants to support multiple currencies and subcategories with drag and drop reordering. Speaker A, B, C, D, E, F and G are working on a new website for their company. They want to improve performance, error messages, color coded notifications, clear messaging help bubbles, offline browsing with cache for common pages, responsive design and a kiosk mode for physical shops are on their wish list. Speaker A, B, C, D, E, F and G attended the second requirements elicitation meeting. They discussed the development of the software requirements specification for the new system. They want to monitor the transition from phone orders to online ones. Speaker A will develop user manuals and training videos tailored to each user role. Speaker A, Rally Karim, Speaker B, Speaker C, Speaker D, Speaker F and Speaker A discuss the data validation and security measures for the new website. Speaker C explains the security measures. Speaker A, Linda and Speaker B discuss the key user flows and accessibility considerations. Speaker E, Speaker A, Speaker B, Speaker C, Speaker D, Speaker E and Speaker F are discussing the design of Puppy's website. They discuss scalability, performance, infrastructure, training, and browser compatibility. They also discuss the deployment and update strategy. BSRS will create a detailed data migration plan for the new system. They will provide ongoing support through a help desk and online knowledge base. The SRS document v0.2 will be updated to reflect today's discussions and will provide a timeline for the next phase.",
              minutes_notes:
              `DATE: April 19, 2025
              ATTENDEES: Speaker A, Speaker B, Speaker C, Speaker D, Speaker E, Speaker F
              
              SUMMARY
              - Gamma JI Web Store project aims to create a plug and play USB based webstore platform that is easy to use as plugging in a mouse.
              - It's aimed at small to mid sized businesses that don't want to depend on Shopify or BigCommerce.
              - It will run on Yalgi's USB platform with an exascale PSA270 chipset.
              - The target hardware environment is Intel based systems minimum 128ebstorm4GB flash storage.
              - There will be at least 2 admins per store for redundancy.
              - Speaker A, B, C, D, E, F, and G are looking for an i18 in ready architecture, basic metrics, views per product, conversion rates, cart abandonment, sales per day, week, month, csev, real time alerts and dashboards.
              - Speaker B wants to integrate a gateway, maybe stripe or a dummy system, future PCI compliance is on the table.
              - Speaker E wants to support multiple currencies and subcategories with drag and drop reordering.
              - Speaker A, B, C, D, E, F and G are working on a new website for their company.
              - They want to improve performance, error messages, color coded notifications, clear messaging help bubbles, offline browsing with cache for common pages, responsive design and a kiosk mode for physical shops are on their wish list.
              - Speaker A, B, C, D, E, F and G attended the second requirements elicitation meeting.
              - They discussed the development of the software requirements specification for the new system.
              - They want to monitor the transition from phone orders to online ones.
              - Speaker A will develop user manuals and training videos tailored to each user role.
              - Speaker A, Rally Karim, Speaker B, Speaker C, Speaker D, Speaker F and Speaker A discuss the data validation and security measures for the new website.
              - Speaker C explains the security measures.
              - Speaker A, Linda and Speaker B discuss the key user flows and accessibility considerations.
              - Speaker E, Speaker A, Speaker B, Speaker C, Speaker D, Speaker E and Speaker F are discussing the design of Puppy's website.
              - They discuss scalability, performance, infrastructure, training, and browser compatibility.
              - They also discuss the deployment and update strategy.
              - BSRS will create a detailed data migration plan for the new system.
              - They will provide ongoing support through a help desk and online knowledge base.
              - The SRS document v0.2 will be updated to reflect today's discussions and will provide a timeline for the next phase.
              
              Minuted by: VOCAMIND`,
              requirements: "**UI/UX Requirements:**\n\n**I. Interface Components:**\n\n*   **User Profile Page:**  A dedicated page for users to create, view, and edit their profiles.  This should include fields for profile picture, bio, interests, and contact information (optional).  The design should prioritize clear labeling and intuitive input methods.\n*   **User Search:** A search bar with auto-suggest functionality to find other users based on keywords (name, interests, etc.).  Results should be displayed in a clear and concise list view, including profile pictures and brief summaries.\n*   **Dashboard:** A personalized dashboard displaying a user's connections, recent activity (new posts, comments, connection requests), and potentially notifications.  The information architecture should prioritize important updates.\n*   **Post Creation Form:** A form allowing users to create posts, including fields for text, images, and potentially videos.  The design should be intuitive and support rich text formatting.\n*   **Post Display:**  A clean and visually appealing layout for displaying posts, including user profile pictures, timestamps, and like/comment buttons.\n*   **Comment Section:**  A threaded comment section below each post, allowing users to reply to individual comments.  The design should be clear and easy to follow.\n*   **Connection Request System:**  A system for sending and managing connection requests, including a clear visual indication of pending requests.\n*   **Navigation Menu:**  A clear and consistent navigation menu allowing users to easily access different sections of the application (profile, search, dashboard, settings).  Consider a hamburger menu or tabbed navigation.\n\n\n**II. User Flows:**\n\n*   **User Registration/Login:** A straightforward registration and login process with clear instructions and error handling.\n*   **Profile Creation:** A guided flow for creating a user profile, ensuring all necessary information is captured.\n*   **User Search and Connection:**  A flow allowing users to search for other users, view their profiles, and send connection requests.\n*   **Post Creation and Sharing:**  A clear flow for creating and sharing posts, including options for adding media.\n*   **Engagement with Posts:**  A flow for liking, commenting, and interacting with posts and comments.\n*   **Notification Management:** A system for managing and viewing notifications, allowing users to mark them as read or dismiss them.\n\n\n**III. Visual Design:**\n\n*   **Color Palette:** A consistent and visually appealing color palette should be used throughout the application.  Consider using brand colors or colors that evoke a sense of community and connection.\n*   **Typography:**  A clear and legible font should be used for all text.  Consider using different font weights and sizes to create visual hierarchy.\n*   **Imagery:**  High-quality images and icons should be used to enhance the visual appeal of the application.\n*   **Layout and Spacing:**  The layout should be clean, organized, and easy to navigate.  Consistent spacing and padding should be used throughout the application.\n*   **Branding:**  Consistent branding elements (logo, color scheme, typography) should be used to create a cohesive brand identity.\n\n\n**IV. Accessibility:**\n\n*   **Keyboard Navigation:**  The application should be fully navigable using a keyboard.\n*   **Screen Reader Compatibility:**  The application should be compatible with screen readers, ensuring all content is accessible to visually impaired users.\n*   **Color Contrast:**  Sufficient color contrast should be used between text and background colors to ensure readability.\n*   **Alternative Text for Images:**  All images should have alternative text descriptions to provide context for screen reader users.\n\n\n**V. Responsive Design:**\n\n*   **Mobile Responsiveness:**  The application should be responsive and adapt to different screen sizes and orientations, providing a seamless user experience on mobile devices.\n*   **Tablet Responsiveness:**  The application should be optimized for tablet devices, providing a comfortable and efficient user experience.\n*   **Desktop Responsiveness:**  The application should be optimized for desktop devices, providing a clear and spacious user interface.\n\n\n**VI. User Interaction:**\n\n*   **Feedback Mechanisms:**  Clear visual and textual feedback should be provided to the user to indicate the status of actions (e.g., loading indicators, success/error messages).\n*   **Error Handling:**  The application should handle errors gracefully and provide clear and helpful error messages.\n*   **Intuitive Interactions:**  The application should use intuitive interactions and gestures to make it easy for users to accomplish their tasks.\n*   **Progress Indicators:**  Use progress indicators to show users the progress of long-running tasks.\n\n\nThis detailed breakdown provides a comprehensive set of UI/UX requirements for the described system.  Remember that these are starting points, and further refinement will be needed based on user research and testing.",
              srs:
                  "# Software Requirements Specification (SRS) for Social Networking Application\n\n**1. Introduction**\n\n**1.1 Purpose**\n\nThis Software Requirements Specification (SRS) document outlines the functional and non-functional requirements for a new social networking application.  This document serves as a guide for developers, testers, and stakeholders throughout the software development lifecycle.  It ensures a shared understanding of the project's goals and specifications.\n\n**1.2 Document Conventions**\n\n* **Acronyms:**  SRS (Software Requirements Specification), UI (User Interface), UX (User Experience), API (Application Programming Interface), GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), WCAG (Web Content Accessibility Guidelines), MFA (Multi-Factor Authentication)\n* **Formatting:** This document uses Markdown formatting.  Requirements are identified using a consistent numbering scheme (e.g., FR1.1).  Tables are used to present structured information.\n* **UML:**  UML diagrams may be added in future revisions for visual representation of system architecture and user flows.\n\n**1.3 Intended Audience and Reading Suggestions**\n\n* **Developers:**  This document provides detailed information on functional and non-functional requirements, guiding implementation. Focus on sections 3 (System Features and Requirements) and appendices (if any).\n* **Testers:** This document is crucial for defining test cases and ensuring the software meets specified requirements.  Focus on sections 3.1 (Functional Requirements) and 3.3 (Non-Functional Requirements).\n* **Stakeholders (Managers, Clients):**  This document provides a high-level overview of the system's capabilities and constraints. Focus on sections 1 (Introduction), 2 (Overall Description), and the executive summary (if any).\n* **UI/UX Designers:** This document informs the design process by outlining the functional needs and user experience expectations. Focus on sections 3.1 (Functional Requirements) and 3.3 (Usability and Visual Design).\n\n\n**1.4 Product Scope**\n\nThis document specifies the requirements for a social networking application allowing users to create profiles, connect with others, share posts, and engage in discussions.  The application aims to provide a user-friendly and engaging platform for social interaction.  Key features include user profile management, user search, a personalized dashboard, post creation and display, comment sections, and a connection request system.  The objective is to create a robust, scalable, and secure social networking platform.\n\n\n**2. Overall Description**\n\n**2.1 Product Perspective**\n\nThis social networking application is designed as a standalone web application, accessible via modern web browsers and mobile devices. Future integrations with other platforms (e.g., calendar applications, email clients) are planned for future releases.\n\n**2.2 Product Features**\n\nThe key features include user profile management, user search, a personalized dashboard, post creation and display, a threaded comment section, a connection request system, and intuitive navigation.  These features are detailed further in Section 3.\n\n**2.3 User Classes and Characteristics**\n\n* **Registered Users:**  Can create profiles, connect with others, share posts, comment, send and receive connection requests, and manage their notification settings.\n* **Administrators (future consideration):**  Will have additional privileges, such as content moderation and user management.  This functionality is outside the scope of the initial release.\n\n**2.4 Operating Environment**\n\n* **Hardware:**  The application should be accessible via various devices (desktops, tablets, smartphones).  Specific hardware requirements for servers will be detailed in the system design document. Client-side devices need only a modern web browser or compatible mobile operating system.\n* **Software:**  The application will be compatible with modern web browsers (Chrome, Firefox, Safari, Edge) and mobile operating systems (iOS and Android).  Specific versions will be defined in the system design document.\n* **Network:**  Requires a stable internet connection for optimal performance.\n\n**2.5 Design and Implementation Constraints**\n\n* **Technology Stack:**  The technology stack (programming languages, frameworks, databases) will be determined based on feasibility, scalability, and maintainability considerations. This will be detailed in the system design document.\n* **Compliance Requirements:**  The application must comply with relevant data privacy regulations (e.g., GDPR, CCPA) and accessibility standards (WCAG).\n\n**2.6 User Documentation**\n\nUser documentation will include a comprehensive help section within the application, FAQs, and potentially video tutorials. This documentation will be developed concurrently with the application.\n\n**2.7 Assumptions and Dependencies**\n\n* **Internet Availability:** The application assumes reliable internet connectivity for optimal performance.  Graceful degradation should be implemented for low-bandwidth situations.\n* **Third-Party APIs:**  The use of third-party APIs (e.g., for image hosting, cloud storage) will be considered based on cost-benefit analysis and security implications.  These will be documented in the system design document.\n\n\n**3. System Features and Requirements**\n\n**3.1 Functional Requirements**\n\n| Requirement ID | Description | Priority | Input/Process/Output |\n|---|---|---|---|\n| FR1.1 | The system shall provide a dedicated page for users to create, view, and edit their profiles. | High | User input (profile data) -> System validates, processes, and stores data -> Displays updated profile. |\n| FR1.2 | The system shall allow users to upload a profile picture. | High | User uploads image -> System validates file type and size, then stores image -> Displays image on profile. |\n| FR1.3 | The system shall allow users to input a bio, interests, and contact information (optional). | Medium | User input (text fields) -> System stores data -> Displays data on profile. |\n| FR1.4 | The system shall display the user's profile information in a clear and concise manner. | High | System retrieves profile data -> System formats and displays data. |\n| FR2.1 | The system shall provide a search bar with auto-suggest functionality to find other users based on keywords (name, interests, etc.). | High | User input (keywords) -> System searches database, providing auto-suggestions -> Displays search results. |\n| FR2.2 | The system shall display search results in a clear and concise list view, including profile pictures and brief summaries. | High | System retrieves search results -> System formats and displays results. |\n| FR3.1 | The system shall provide a personalized dashboard displaying a user's connections, recent activity (new posts, comments, connection requests), and notifications. | High | System retrieves user data -> System displays personalized dashboard, prioritizing important updates. |\n| FR3.2 | The system shall prioritize important updates (e.g., connection requests) on the dashboard. | High | System uses algorithm to determine importance -> System prioritizes display of updates. |\n| FR4.1 | The system shall provide a form allowing users to create posts, including fields for text, images, and videos. | High | User input (text, images, videos) -> System validates and stores post data -> Displays post. |\n| FR4.2 | The system shall support rich text formatting (bold, italics, lists) in post creation. | Medium | User input (formatted text) -> System renders formatted text -> Displays formatted text in post. |\n| FR4.3 | The system shall display posts in a clean and visually appealing layout, including user profile pictures, timestamps, and like/comment buttons. | High | System retrieves post data -> System formats and displays post. |\n| FR5.1 | The system shall provide a threaded comment section below each post, allowing users to reply to individual comments. | High | User input (comment) -> System stores comment -> Displays comment in threaded view. |\n| FR5.2 | The system shall display comments in a clear and easy-to-follow manner, with proper indentation for replies. | High | System retrieves comments -> System formats and displays comments with proper threading. |\n| FR6.1 | The system shall provide a system for sending and managing connection requests.  Users can send, receive, accept, or reject requests. | High | User initiates request -> System manages request status and notifications -> Displays request status to sender and receiver. |\n| FR6.2 | The system shall display a clear visual indication (e.g., badge) of pending connection requests. | High | System checks for pending requests -> System displays visual indication. |\n| FR7.1 | The system shall provide a clear and consistent navigation menu allowing users to easily access different sections of the application (profile, search, dashboard, settings, help). | High | System displays navigation menu -> User selects option -> System navigates to selected section. |\n| FR8.1 | The system shall provide a secure registration and login process with clear instructions and error handling. | High | User input (credentials) -> System validates credentials, employing secure hashing -> Provides feedback to user. |\n| FR8.2 | The system shall guide users through a profile creation flow, ensuring all necessary information is captured (name, username, email, password). | High | System guides user through steps -> System validates input -> Stores profile information. |\n| FR8.3 | The system shall allow users to search for other users, view their profiles, and send connection requests. | High | User searches for users -> System displays profiles -> User sends requests. |\n| FR8.4 | The system shall provide a clear flow for creating and sharing posts, including options for adding media (images, videos). | High | System guides user through post creation -> System validates input -> Stores and displays post. |\n| FR8.5 | The system shall allow users to engage with posts, including liking, commenting, and interacting with comments (replying, editing, deleting). | High | User interacts with post -> System updates post status and notifications -> Displays updated status. |\n| FR8.6 | The system shall provide a system for managing and viewing notifications, allowing users to mark them as read or dismiss them. | Medium | System generates notifications -> System displays notifications -> User manages notifications. |\n\n\n**3.3 Non-Functional Requirements**\n\n**3.3.1 Performance Requirements**\n\n* NFR1.1: The system shall respond to user input within 2 seconds (95th percentile).\n* NFR1.2: The system shall be able to handle at least 100 concurrent users initially, with scalability to 1000 concurrent users within 6 months.\n\n**3.3.2 Security Requirements**\n\n* NFR2.1: The system shall encrypt user data both in transit (HTTPS) and at rest using industry-standard encryption algorithms (AES-256).\n* NFR2.2: The system shall implement secure authentication and authorization mechanisms, including password hashing (bcrypt or Argon2) and the option for multi-factor authentication (MFA).  Regular security audits will be conducted.\n* NFR2.3: The system shall protect against common web vulnerabilities (SQL injection, cross-site scripting, etc.).\n\n**3.3.3 Reliability & Availability**\n\n* NFR3.1: The system shall aim for 99.9% uptime.  Regular backups and disaster recovery plans will be implemented.\n\n**3.3.4 Maintainability**\n\n* NFR4.1: The system shall be designed with modularity and comprehensive code documentation to facilitate future maintenance and updates.\n\n**3.3.5 Portability**\n\n* NFR5.1: The application should be designed for cross-platform compatibility (web, iOS, Android).  A responsive design will ensure optimal user experience across different devices.\n\n**3.3.6 Usability**\n\n* NFR6.1: The system shall provide clear and concise feedback to users.\n* NFR6.2: The system shall be intuitive and easy to use, requiring minimal training.\n* NFR6.3: The system shall provide accessible error handling and recovery mechanisms, with user-friendly error messages.\n\n**3.3.7 Accessibility**\n\n* NFR7.1: The system shall be fully navigable using a keyboard.\n* NFR7.2: The system shall be compatible with screen readers.\n* NFR7.3: The system shall use sufficient color contrast between text and background colors (WCAG AA compliance).\n* NFR7.4: The system shall provide alternative text descriptions for all images.\n\n**3.3.8 Responsiveness**\n\n* NFR8.1: The system shall be responsive and adapt to different screen sizes and orientations on mobile devices.\n* NFR8.2: The system shall be optimized for tablet devices.\n* NFR8.3: The system shall be optimized for desktop devices.\n\n**3.3.9 Visual Design**\n\n* NFR9.1: The system shall use a consistent and visually appealing color palette throughout the application, aligned with branding guidelines.\n* NFR9.2: The system shall use a clear and legible font for all text.\n* NFR9.3: The system shall use high-quality images and icons to enhance visual appeal.\n* NFR9.4: The system shall maintain a clean, organized, and easy-to-navigate layout.\n\n\n**4. Conclusion**\n\nThis SRS document provides a comprehensive overview of the requirements for the social networking application.  Further details and specifications will be elaborated in subsequent design and implementation documents.  Regular reviews and updates to this document will be conducted to ensure it remains aligned with the evolving project needs.",
              uml:
                  `@startuml
                  actor Customer
                  actor Sales_Personnel
                  actor Administrator

                  Customer --> Customer Registration/Login
                  Customer --> Product Browsing/Searching
                  Customer --> Add to Cart
                  Customer --> Checkout Process
                  Customer --> Order Tracking
                  Customer --> Account Management

                  Sales_Personnel --> Inventory Management
                  Sales_Personnel --> Product Browsing/Searching

                  Administrator --> Admin Dashboard
                  Administrator --> User Management
                  Administrator --> Product Management
                  Administrator --> System Settings Management

                  @enduml`,
          };

          
            const normalized = {
                summaryText: apiResponse.summary,
                minutes: apiResponse.minutes_notes,
                extracted_requirements: apiResponse.requirements,
                srs_document: apiResponse.srs,
                uml_diagram: apiResponse.uml
            };

            const normalized2 = {
              summaryText: dummyMode2Data.summary,
              minutes: dummyMode2Data.minutes_notes,
              extracted_requirements: dummyMode2Data.requirements,
              srs_document: dummyMode2Data.srs,
              uml_diagram: dummyMode2Data.uml
            };

            if (selectedMode === 1) {
                setFeatureData(normalized);
                setCompletedSteps(prev => [...prev, selectedFeature.id]);
            } else if (selectedMode === 2 && localFile) {
                setFeatureData2(normalized2);
            }

        }, 3000);
    }
}, [selectedFeature, localFile, selectedMode]);


  

  const handleStepClick = (step) => {
    if (selectedMode === 2 && localFile) return;
    setSelectedFeature(step);
    if (selectedMode === 2) {
      setLocalFile(null);
      setFeatureData(null);
    }
  };


  const handleGoBack = () => {
    if (selectedMode === 2 && selectedFeature) {
      // In Mode 2, and currently viewing feature output → go back to feature selection
      setSelectedFeature(null);
      setFeatureData(null);
      setFeatureData2(null);    // ← also reset Mode 2 data
      setLocalFile(null);
      setError(null);
    } else {
      // In Mode 1 OR already at selection screen in Mode 2 → go back to Step 2
      setSelectedFeature(null);
      setFeatureData(null);
      setLocalFile(null);
      setError(null);
      setTimeout(() => {
        goBack();
      }, 0);
    }
  };
  
  // const handleGenerateUI = async () => {
  //   setLoading(true);
  //   setError("");
  //   setImagePath("");
  //   try {
  //     const res = await axios.post("/api/ui/generate-ui", { caption });
  //     // setImagePath(`https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24972797/Loki_CharacterSeries_Loki_v2_lg.jpeg?quality=90&strip=all&crop=19.342417061611,0,61.315165876777,100`);
  //     setImagePath(`http://localhost:5000${res.data.path}`);
  //   } catch (err) {
  //     setError("Failed to generate image");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSaveAsPdf = async () => {
  //   if (!selectedFeature || !featureData) return;
  
  //   const pdf = new jsPDF();
  
  //   const textMap = {
  //     summary: featureData.summaryText,
  //     minutes: featureData.minutes,
  //     requirements: featureData.extracted_requirements,
  //     srs: featureData.srs_document,
  //   };
  
  //   if (selectedFeature.id === 'uml') {
  //     try {
  //       const svgUrl = `https://www.plantuml.com/plantuml/svg/${encode(cleanPlantUmlCode(featureData.uml_diagram))}`;
  //       const response = await fetch(svgUrl);
  //       const svgText = await response.text();
  
  //       // Convert SVG text to data URL (base64 PNG using canvas)
  //       const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
  //       const svgUrlObject = URL.createObjectURL(svgBlob);
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         const ctx = canvas.getContext('2d');
  //         ctx.drawImage(img, 0, 0);
  
  //         const pngDataUrl = canvas.toDataURL('image/png');
  //         pdf.addImage(pngDataUrl, 'PNG', 10, 10, 180, 160); // Adjust width/height as needed
  //         pdf.save(`${selectedFeature.name}.pdf`);
  //         URL.revokeObjectURL(svgUrlObject);
  //       };
  //       img.src = svgUrlObject;
  //     } catch (err) {
  //       console.error("Error embedding UML diagram:", err);
  //       alert("Failed to export UML diagram. Try again.");
  //     }
  //   } else {
  //     const content = textMap[selectedFeature.id] || 'No content available.';
  //     const lines = pdf.splitTextToSize(content, 180);
  //     pdf.text(lines, 10, 10);
  //     pdf.save(`${selectedFeature.name}.pdf`);
  //   }
  // };
  const handleSaveAsPdf = async () => {
    // choose the right data object based on mode
    const data = selectedMode === 1 ? featureData : featureData2;
    if (!selectedFeature || !data) return;
  
    const pdf = new jsPDF();
  
    // pick the text or UML code from the data object
    const content = (() => {
      switch (selectedFeature.id) {
        case 'summary':
          return data.summaryText;
        case 'minutes':
          return data.minutes;
        case 'requirements':
          return data.extracted_requirements;
        case 'srs':
          return data.srs_document;
        case 'uml':
          return data.uml_diagram;
        default:
          return 'No content available.';
      }
    })();
  
    if (selectedFeature.id === 'uml') {
      try {
        const umlCode = content;
        const svgUrl = `https://www.plantuml.com/plantuml/svg/${encode(cleanPlantUmlCode(umlCode))}`;
        const response = await fetch(svgUrl);
        const svgText = await response.text();
  
        // Convert SVG to PNG using canvas
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const svgUrlObject = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
  
          const pngDataUrl = canvas.toDataURL('image/png');
          pdf.addImage(pngDataUrl, 'PNG', 10, 10, 180, 160);
          pdf.save(`${selectedFeature.name}.pdf`);
          URL.revokeObjectURL(svgUrlObject);
        };
        img.src = svgUrlObject;
      } catch (err) {
        console.error("Error embedding UML diagram:", err);
        alert("Failed to export UML diagram. Try again.");
      }
    } else {
      // split text into lines and add to PDF
      const lines = pdf.splitTextToSize(content || 'No content available.', 180);
      pdf.text(lines, 10, 10);
      pdf.save(`${selectedFeature.name}.pdf`);
    }
  };
  
  
  const selectedindices = [0,1,2,3,4];
  const filteredsteps = steps.filter((_,x)=>selectedindices.includes(x));


const [iframeSrc, setIframeSrc] = useState("");
const [showIframe, setShowIframe] = useState(false);

// Map captions to static HTML previews
const captionMap = {
  "The login page features a clean, modern interface with a centered card-style container on a soft, gradient background that transitions from light blue to white, creating a welcoming atmosphere. At the top of the container, a bold yet minimalist logo sits above a clear \"Welcome Back\" header and a subtle subtext encouraging users to sign in. The form includes two input fields with rounded corners and subtle drop shadows—one for the email or username and another for the password—each accompanied by intuitive icons for better usability. Below the inputs, a prominent primary button labeled \"Log In\" is styled with a vibrant accent color that stands out while maintaining accessibility. Additional links for \"Forgot Password?\" and \"Create Account\" are styled as underlined text, placed thoughtfully to guide users without cluttering the layout. The overall design is responsive, ensuring optimal display on both desktop and mobile devices, with smooth transitions and hover effects enhancing interactivity":
    "/ui_output/temp1.html",

  "The to-do list page has a clean and centered layout. At the top, there's a bold title like “My Tasks.” Below it, there's a single input field where users can type a task, with an “Add” button next to it. When a task is added, it appears in a list below. Each task is displayed in a row with a checkbox on the left to mark it as complete, the task name in the center, and a small delete icon or button on the right to remove it. Completed tasks are either crossed out or faded to show they’re done. The design is simple, with soft colors and clear spacing to keep everything easy to read and use.":
    "/ui_output/temp2.html",
};

const handleGenerateUI = () => {
  console.log("Generating UI for caption:", caption);
  const matchedSrc = captionMap[caption.trim()];
  if (matchedSrc) {
    console.log("Match found:", matchedSrc);
    setIframeSrc(matchedSrc);
    setShowIframe(true);
    setError("");
  } else {
    console.log("No match found.");
    setError("No matching UI found for this caption.");
    setShowIframe(false);
  }
};


  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-4xl font-bold mb-4">
        {selectedMode === 1 ? "Processing Steps" : "Select a Specific Feature"}
      </h2>
      <p className="text-neutral-400 mb-6">
        {selectedMode === 1
          ? "Click any step to process it in any order."
          : "Choose a specific feature, then upload a file."}
      </p>

      {uploadedFile && selectedMode === 1 && (
        <p className="text-green-400 mt-2 mb-6">
          Using uploaded file: <span className="font-semibold">{uploadedFile.name}</span>
        </p>
      )}

      {selectedMode === 1 && (
        <div className="grid grid-cols-5 gap-6 w-full max-w-5xl mt-4">
          {filteredsteps.map((step) => ( 
            <div key={step.id} className="flex flex-col items-center">
              <div className="group relative">
                <button
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-full text-white font-semibold shadow-md transition-all
                    ${step.color} ${completedSteps.includes(step.id) ? "opacity-70" : "hover:opacity-100"}`}
                  onClick={() => handleStepClick(step)}
                >
                  {completedSteps.includes(step.id) ? <CheckCircle size={40} /> : step.icon}
                </button>
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center w-44 bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                  {step.description}
                  <Info size={14} className="absolute -bottom-3 text-gray-900" />
                </div>
              </div>
              <span className="text-white mt-2 text-sm">{step.name}</span>
              {/* {completedSteps.includes(step.id) && (
                <div className="mt-3 p-3 bg-gray-800 rounded-md text-sm text-green-400 w-40">
                  ✅ Completed!
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}

      {selectedMode === 2 && !selectedFeature && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-2xl">
          {steps.map((feature) => (
            <button
              key={feature.id}
              disabled={!!localFile}
              className={`flex flex-col items-center justify-center p-6 w-48 h-32 ${feature.color} 
                ${localFile ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'} 
                rounded-xl shadow-md transition`}
              onClick={() => handleStepClick(feature)}>
              {feature.icon}
              <span className="text-white mt-2 text-center">{feature.name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedMode === 2 && selectedFeature && !localFile && !featureData2 && selectedFeature.id !== "ui" &&  (
        <div className="mt-6 flex flex-col items-center">
          <label className="flex flex-col items-center px-6 py-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
            <UploadCloud size={40} className="text-white" />

            <span className="mt-2 text-white">Upload File</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {selectedMode === 2 && selectedFeature && !localFile && !featureData2 && selectedFeature.id === "ui" && (
        <div className="mt-6 flex flex-col items-center">
          <label className="flex flex-col items-center px-6 py-4 bg-gray-800 rounded-lg">
            <ClipboardPenLine size={40} className="text-white" />
            <span className="mt-2 text-white">Write your UI Description</span>
            <textarea
              className="w-[650px] h-[190px] mt-4 px-4 py-2 rounded-md text-lg text-sm bg-white text-black resize"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
            <button
              onClick={handleGenerateUI}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
            >
              Generate
            </button>
          </label>
           {/* Error Message */}
           {error && <p className="text-red-500">{error}</p>}

            {/* Iframe Preview (after matching) */}
            {iframeSrc && (
              <div className="pt-4">
                <h5 className="text-lg font-semibold mb-2">Interactive Preview:</h5>
                <iframe
                  key={iframeSrc} // ensure re-render
                  src={iframeSrc}
                  title="UI Preview"
                  width="700px"
                  height="500px"
                  className="border rounded-lg"
                />
              </div>
            )}
            </div>
      )}


          {/* Display Features */}
      {selectedFeature && (selectedMode === 1 ? featureData : featureData2) && (
        <div className="mt-6 p-6 pb-20 bg-gray-800 rounded-lg shadow-md max-w-5xl w-full h-auto text-left relative">
          <h3 className="text-xl font-semibold text-white mb-2">{selectedFeature.name} Processed</h3>

          {selectedFeature.id === "summary" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              {/* <h4 className="text-white font-semibold">Summary</h4> */}
              <p className="whitespace-pre-wrap text-sm">
                {selectedMode === 1 ? featureData.summaryText : featureData2.summaryText}
              </p>
            </div>
          )}

          {selectedFeature.id === "minutes" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              {/* <h4 className="text-white font-semibold">Minutes</h4> */}
              <pre className="whitespace-pre-wrap text-sm">
                {selectedMode === 1 ? featureData.minutes : featureData2.minutes}
              </pre>
            </div>
          )}

          {selectedFeature.id === "requirements" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              {/* <h4 className="text-white font-semibold">Extracted Requirements</h4> */}
              <pre className="whitespace-pre-wrap text-sm">
              <ReactMarkdown>
                {selectedMode === 1 ? featureData.extracted_requirements : featureData2.extracted_requirements}
                </ReactMarkdown>
              </pre>
            </div>
          )}

          {selectedFeature.id === "srs" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200">
              {/* <h4 className="text-white font-semibold mb-2">SRS Document</h4> */}
              <div className="prose prose-invert max-w-none text-neutral-300 bg-gray-900 p-4 rounded-md text-sm">
                <ReactMarkdown>
                  {selectedMode === 1 ? featureData.srs_document : featureData2.srs_document}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {selectedFeature.id === "uml" && (
            <div className="h-full overflow-y-auto p-4 bg-gray-900 rounded-md text-neutral-200 text-sm">
              {/* <h4 className="text-white font-semibold">UML Diagram</h4> */}
              <UmlRenderer
                umlCode={selectedMode === 1 ? featureData.uml_diagram : featureData2.uml_diagram}
              />
            </div>
          )}

          <button
            onClick={handleSaveAsPdf}
            className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-800 rounded-full w-32 h-8 text-sm text-white hover:brightness-110 transition"
          >
            Save as a PDF
          </button>
        </div>
      )}


      <button
        onClick={handleGoBack}
        className="flex items-center justify-center space-x-2 px-4 py-3 text-neutral-400 hover:text-white mt-10 transition"
      >
        <ArrowLeft size={20} />
        <span> Back</span>
      </button>
    </div>
  );
};

export default Step3;
