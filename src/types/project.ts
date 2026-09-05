export type ProjectCategory = 
  | 'Robotics'
  | 'Embedded Systems'
  | 'Computer Vision'
  | 'Control Systems'
  | 'IoT & Industrial'
  | 'Software Engineering'
  | 'Mechatronics Integration';

export interface ExtractedFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  isEntryCandidate?: boolean;
  children?: ExtractedFileNode[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  year: string;
  role: string;
  duration: string;
  organization?: string;
  team?: string;
  
  // Engineering Story & Methodology
  problem: string;
  objective: string;
  approach: string;
  features: string[];
  results: string[];
  
  // Technical Specifications
  technologies: string[];
  programmingLanguages: string[];
  frameworks: string[];
  hardware: string[];
  sensors: string[];
  tools: string[];
  
  // External & Action Links
  githubUrl?: string;
  liveDemoUrl?: string;
  docsUrl?: string;
  youtubeUrl?: string;
  downloadUrl?: string;
  
  // Media & Graphics
  thumbnail: string;
  gallery: string[];
  
  // Local ZIP & Runtime Execution
  hasZip: boolean;
  zipFileName?: string;
  zipFileSize?: number;
  extractedPath?: string;
  entryPoint?: string; // e.g. "index.html" or "dist/index.html"
  runtimeUrl?: string; // e.g. "/api/runtime/slug/"
  extractedTree?: ExtractedFileNode[];
  
  // Settings & Visibility
  published: boolean;
  featured: boolean;
  displayOrder: number;
}
