export type MechanicalCategory = 
  | 'Robotic Mechanism'
  | 'Chassis & Structure'
  | 'Actuator & Drivetrain'
  | 'Enclosure & Packaging'
  | 'Tooling & Fixtures'
  | 'Biomechanical Design'
  | 'Aero & Fluid Structure';

export interface MechanicalSpecItem {
  label: string;
  value: string;
  unit?: string;
  category?: 'Geometry' | 'Material' | 'Kinematics' | 'Manufacturing' | 'Performance';
}

export interface CADFileAttachment {
  id: string;
  name: string;
  format: 'STEP' | 'STP' | 'IGES' | 'IGS' | 'STL' | 'SLDPRT' | 'SLDASM' | 'F3D' | 'PDF' | 'DXF' | 'ZIP' | 'CAD' | string;
  size: string;
  downloadUrl?: string;
  description?: string;
}

export interface EngineeringDrawing {
  id: string;
  title: string;
  drawingNumber: string;
  revision: string;
  pdfUrl?: string;
  previewUrl: string;
  description?: string;
}

export interface MechanicalDesign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: MechanicalCategory;
  year: string;
  
  // Technical Specifications
  dimensions: string; // e.g. "320 x 240 x 180 mm"
  weight: string; // e.g. "1.45 kg"
  materials: string[]; // e.g. ["Aluminum 6061-T6", "PETG Carbon Fiber", "Stainless Steel 304"]
  manufacturingMethods: string[]; // e.g. ["CNC 3-Axis Milling", "FDM 3D Printing", "Sheet Metal Laser Cutting"]
  tolerances: string; // e.g. "ISO 2768-m, Critical fits: H7/g6"
  cadSoftware: string[]; // e.g. ["SolidWorks 2024", "Autodesk Fusion 360"]
  simulationSoftware?: string[]; // e.g. ["ANSYS Workbench", "SolidWorks Simulation"]
  
  // Design Narrative
  problem: string;
  solution: string;
  keyFeatures: string[];
  feaResults?: string; // Stress/Deflection analysis notes
  specifications: MechanicalSpecItem[];
  
  // Files & Media
  thumbnail: string;
  gallery: string[];
  cadFiles: CADFileAttachment[];
  drawings: EngineeringDrawing[];
  model3dUrl?: string; // e.g. GLTF or STL model for 3D web preview
  
  // Settings
  published: boolean;
  featured: boolean;
  displayOrder: number;
}
