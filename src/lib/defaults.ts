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
  cv: {
    summary: "",
    education: [],
    certifications: [],
    keywords: [],
    engineeringSkills: [],
    softwareTools: [],
    softSkills: [],
    languages: [],
    interests: [],
    strengths: [],
    values: [],
  },
  contact: { email: "", phone: "", location: "" },
  seo: {
    title: "Alex Kariuki | Electrical & Electronics Engineer",
    description:
      "Portfolio of Alex Kariuki — Electrical & Electronics Engineer specializing in power systems, control, and automation.",
  },
};

// Deep-merges stored content with the defaults so that adding new fields to
// SiteContent later (e.g. `cv`) never crashes pages when older saved content
// in B2 predates that field.
export function normalizeContent(raw: Partial<SiteContent> | null | undefined): SiteContent {
  const r = raw || {};
  return {
    ...defaultContent,
    ...r,
    hero: { ...defaultContent.hero, ...(r.hero || {}) },
    socials: r.socials && r.socials.length > 0 ? r.socials : defaultContent.socials,
    traits: r.traits && r.traits.length > 0 ? r.traits : defaultContent.traits,
    about: {
      ...defaultContent.about,
      ...(r.about || {}),
      stats: r.about?.stats && r.about.stats.length > 0 ? r.about.stats : defaultContent.about.stats,
    },
    skills: r.skills && r.skills.length > 0 ? r.skills : defaultContent.skills,
    tools: r.tools && r.tools.length > 0 ? r.tools : defaultContent.tools,
    experience: r.experience || [],
    cv: {
      ...defaultContent.cv,
      ...(r.cv || {}),
      education: r.cv?.education || [],
      certifications: r.cv?.certifications || [],
      keywords: r.cv?.keywords || [],
      engineeringSkills: r.cv?.engineeringSkills || [],
      softwareTools: r.cv?.softwareTools || [],
      softSkills: r.cv?.softSkills || [],
      languages: r.cv?.languages || [],
      interests: r.cv?.interests || [],
      strengths: r.cv?.strengths || [],
      values: r.cv?.values || [],
    },
    testimonials: r.testimonials || [],
    contact: { ...defaultContent.contact, ...(r.contact || {}) },
    seo: { ...defaultContent.seo, ...(r.seo || {}) },
  };
}
