import {
  Mic,
  FileText,
  ClipboardList,
  ListChecks,
  LayoutTemplate,
  FileCog,
  GitMerge,
} from "lucide-react";


export const navItems = [
  { label: "Home", scrollTo: "home" }, // Scrolls to top or navigates first
  { label: "Features", scrollTo: "features" },
  { label: "Workflow", scrollTo: "workflow" },
  { label: "Start Automation", href: "/run-workflow" },
  { label: "Contact Us", href: "/contact" },
];


export const features = [
  {
    icon: <FileText />,
    text: "Automated Meeting Summaries",
    description:
      "Instantly generate concise summaries with key decisions and action items.",
  },
  {
    icon: <ClipboardList />,
    text: "Meeting Minutes Generation",
    description:
      "Automatically create structured meeting minutes for better documentation.",
  },
  {
    icon: <ListChecks />,
    text: "Software Requirements Extraction",
    description:
      "Identify and extract functional and non-functional requirements from discussions.",
  },
  {
    icon: <FileCog />,
    text: "SRS Document Generation",
    description:
      "Generate well-structured and detailed Software Requirement Specification documents to ensure clarity and effective project planning.",
  },
  {
    icon: <GitMerge />,
    text: "UML Diagram Generation",
    description:
      "Creates UML diagrams from text to visualize software architecture and workflows.",
  },
  {
    icon: <LayoutTemplate />,
    text: "Smart UI Design Generation",
    description:
      "Convert requirements into UI layout recommendations.",
  },
];

export const checklistItems = [
  {
    title: "Transcribe & Identify Speakers",
    description:
      "Get an accurate real-time transcript with speaker recognition immediately after the meeting.",
  },
  {
    title: "Summarize Key Points",
    description:
      "Generate a concise AI-powered summary highlighting decisions, action items, and important discussions.",
  },
  {
    title: "Document Meeting Minutes",
    description:
      "Automatically create a structured meeting minutes report to keep your team aligned.",
  },
  {
    title: "Extract Software Requirements",
    description:
      "Identify and structure discussed functional requirements for seamless project planning.",
  },
  {
    title: "Create an SRS Document",
    description:
      "Produce a detailed Software Requirements Specification (SRS) document for developers to work with.",
  }, {
    title: "Generate UI Design Suggestions (If Applicable)",
    description:
      "Convert discussed UI requirements into initial layout recommendations.",
  },
  {
    title: "Generate UML Diagrams",
    description:
      "Automatically creates clear and structured UML diagrams from text, simplifying system design and communication.",
  },
];


export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
