export interface StatItem {
  icon: string;
  label: string;
  value: string;
}

export interface TraitItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface SkillItem {
  name: string;
  percent: number;
}

export interface ToolItem {
  name: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  current: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  included: boolean;
}

export interface CVData {
  summary: string;
  education: EducationItem[];
  certifications: CertificationItem[];
  keywords: string[];
  engineeringSkills: string[];
  softwareTools: string[];
  softSkills: string[];
  languages: string[];
  interests: string[];
  strengths: string[];
  values: string[];
  // Explicit whitelist of skill/tool names to show under Technical Skills.
  // Empty/undefined means "show everything" (backward compatible default).
  selectedSkillNames: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarKey?: string;
}

export interface SiteContent {
  hero: {
    greeting: string;
    firstName: string;
    lastName: string;
    role: string;
    description: string;
    portraitKey: string;
    backgroundKey: string;
  };
  socials: { platform: string; url: string }[];
  traits: TraitItem[];
  about: {
    eyebrow: string;
    title: string;
    description: string;
    tags: string[];
    stats: StatItem[];
  };
  skills: SkillItem[];
  tools: ToolItem[];
  experience: ExperienceItem[];
  cv: CVData;
  testimonials: Testimonial[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface ProjectSection {
  heading: string;
  body: string;
}

export interface ProjectMediaItem {
  type: "image" | "pdf" | "video";
  key: string;
  caption?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  technologies: string[];
  coverImageKey: string;
  coverImagePosition: string;
  featured: boolean;
  order: number;
  status: "draft" | "published";
  projectType: "technical" | "software";
  includeInCV: boolean;
  problemStatement: string;
  objectives: string;
  designProcess: string;
  implementation: string;
  results: string;
  challenges: string;
  lessonsLearned: string;
  gallery: ProjectMediaItem[];
  documents: ProjectMediaItem[];
  videos: ProjectMediaItem[];
  createdAt: string;
  updatedAt: string;
  // --- Software / web project only ---
  tagline?: string;
  liveUrl?: string;
  demoUrl?: string;
  role?: string;
  timeline?: string;
  duration?: string;
  teamSize?: string;
  keyFeatures?: string[];
  techStackFrontend?: string[];
  techStackBackend?: string[];
  techStackDatabase?: string[];
  techStackTools?: string[];
  metrics?: ProjectMetric[];
  challengesSolutions?: ChallengeSolution[];
}
