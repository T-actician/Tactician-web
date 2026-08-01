import { SiteContent } from "@/types/content";

export const CONTENT_KEY = "content/site.json";
export const PROJECTS_KEY = "content/projects.json";

export const defaultContent: SiteContent = {
  hero: {
    greeting: "Hello, I'm",
    firstName: "Alex",
    lastName: "Kariuki",
    role: "Electrical & Electronics Engineer",
    description:
      "I design, build and optimize electrical systems that power industries and improve lives. Passionate about solving complex problems and delivering reliable, efficient and innovative solutions.",
    portraitKey: "",
    backgroundKey: "",
    cvKey: "",
  },
  socials: [
    { platform: "linkedin", url: "" },
    { platform: "github", url: "" },
    { platform: "email", url: "" },
    { platform: "phone", url: "" },
  ],
  traits: [
    { icon: "zap", title: "Problem Solver", subtitle: "Analytical Thinking" },
    { icon: "target", title: "Detail Oriented", subtitle: "Precision & Quality" },
    { icon: "shield", title: "Reliable", subtitle: "Results Driven" },
    { icon: "lightbulb", title: "Innovative", subtitle: "Always Improving" },
  ],
  about: {
    eyebrow: "About Me",
    title: "Turning Ideas Into Impact",
    description:
      "I'm an Electrical & Electronics Engineer with a strong foundation in power systems, control, and electronics. I enjoy turning ideas into practical solutions — from concept and design to testing and implementation.",
    tags: ["Power Systems", "Electronics", "Control Systems", "Automation"],
    stats: [
      { icon: "briefcase", label: "Projects Completed", value: "10+" },
      { icon: "user", label: "Years Learning", value: "4+" },
      { icon: "smile", label: "Client Satisfaction", value: "100%" },
      { icon: "clock", label: "Passion & Dedication", value: "24/7" },
    ],
  },
  skills: [
    { name: "Electrical System Design", percent: 95 },
    { name: "Control Systems", percent: 90 },
    { name: "PLC & Automation", percent: 85 },
    { name: "Troubleshooting", percent: 90 },
    { name: "Technical Documentation", percent: 95 },
  ],
  tools: [
    { name: "AutoCAD", icon: "autocad" },
    { name: "PLC", icon: "plc" },
    { name: "Arduino", icon: "arduino" },
    { name: "Proteus", icon: "proteus" },
    { name: "MATLAB", icon: "matlab" },
    { name: "VS Code", icon: "vscode" },
  ],
  testimonials: [],
  experience: [],
  contact: { email: "", phone: "", location: "" },
  seo: {
    title: "Alex Kariuki | Electrical & Electronics Engineer",
    description:
      "Portfolio of Alex Kariuki — Electrical & Electronics Engineer specializing in power systems, control, and automation.",
  },
};
