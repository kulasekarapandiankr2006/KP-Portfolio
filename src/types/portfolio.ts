export interface ProfileStat {
  label: string;
  value: string;
  subtext?: string;
}

export interface Profile {
  name: string;
  preferredName?: string;
  title: string;
  subtitle: string;
  statusBadge: string;
  bio: string[];
  engineeringPhilosophy: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  youtubeUrl?: string;
  cadPortfolioUrl?: string;
  stats: ProfileStat[];
}

export interface FocusArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  organizationUrl?: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Research' | 'Student Team' | 'Contract';
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  major: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  honors?: string;
  coursework: string[];
  highlights: string[];
}

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar';
  highlighted?: boolean;
}

export interface SkillGroup {
  id: string;
  category: string;
  description: string;
  icon: string;
  skills: SkillItem[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  awardLevel?: string;
  description: string;
  link?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  conferenceOrJournal: string;
  date: string;
  doi?: string;
  abstract: string;
  paperUrl?: string;
  pdfUrl?: string;
  tags: string[];
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  date: string;
  award: string;
  rank?: string;
  description: string;
  projectSlug?: string;
  technologies: string[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional Working' | 'Conversational' | 'Elementary';
  notes?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  icon: string;
}
