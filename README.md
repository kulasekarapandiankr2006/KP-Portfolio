# ⚡ Kulasekara Pandian K R — Cyber-Physical Engineering Portfolio

<div align="center">

[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=for-the-badge)](https://github.com/darkroomengineering/lenis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**An award-caliber, highly immersive, cinematic interactive portfolio engineered for a Mechatronics, Autonomous Robotics, and Embedded Firmware Systems Architect.**

[Live Demonstration](#) • [Explore Projects](#-featured-engineering-showcases) • [Inspect CAD Models](#-mechanical-cad-showroom) • [Admin Portal](#-admin-cms-portal)

</div>

---

## 🧭 Executive Overview

This portfolio is crafted as a **precision cyber-physical experience**, moving away from generic templates into an Awwwards-inspired digital terminal. Designed to reflect the high-stakes precision of robotics and mechatronics engineering:

- **Robotics & Autonomy**: ROS 2 Humble, Nav2 navigation stack, 2D/3D LiDAR SLAM, Gazebo simulation.
- **Embedded Real-Time Firmware**: Deterministic FreeRTOS, STM32 (ARM Cortex-M4/M7), 20 kHz dual-loop Field-Oriented Control (FOC), high-speed CAN FD / CANopen buses.
- **Precision Mechanical CAD & DFM**: Cycloidal gearboxes, planetary wheel pods, aerospace aluminum chassis, topology optimization, ANSYS FEA stress analysis.

---

## ✨ Interactive Experience & Motion Design Highlights

### 1. 🚀 Cinematic Mechatronics Preloader
- Real-time boot sequence simulating sensor calibrations:
  - *"INITIALIZING DUAL-LOOP FOC MOTOR DRIVERS"*
  - *"CALIBRATING 9-DOF IMU SENSOR FUSION"*
  - *"CONNECTING ROS 2 HUMBLE BRIDGE"*
- Rotating concentric telemetry radar rings with animated percentage counter.
- Seamless curtain reveal into the hero section with session storage caching.

### 2. 🎯 Dual-Ring Physics Custom Cursor
- Inertial follower ring with smooth lerp interpolation (`0.16` dampening factor) and crisp inner laser dot.
- Contextual state machine driven by data attributes:
  - Default state: Subtle cyan ring
  - Interactive state: Magnetic scale hover on buttons and links
  - Project cards: Expands with `"VIEW"` contextual label
  - CAD Showroom: Transforms into amber specular ring with `"CAD"` badge
- Automatically and gracefully disabled on touchscreens (`pointer: coarse`) and when `prefers-reduced-motion` is active.

### 3. 🌊 Lenis Inertial Smooth Scrolling
- Integrated lightweight Lenis 60fps smooth scrolling with momentum physics.
- Automatically pauses during modal drawers to preserve scroll position and eliminate layout shifts.

### 4. 📐 3D Multi-Axis Card Tilt & Specular Lighting
- Custom GPU-accelerated 3D perspective tilt (`perspective(1000px) rotateX(...) rotateY(...)`).
- Dynamic specular spotlight tracking cursor position in real time using CSS custom properties (`--mx`, `--my`) without triggering React re-renders.

### 5. 🔍 In-Page Project Quick-View Modal
- Instant modal drawer allowing technical recruiters and engineers to inspect project galleries, problems, solutions, and innovations without navigating away from the feed.
- Full deep-link support preserved for dedicated case study pages (`/projects/:slug`) and runnable web simulations (`/projects/:slug/run`).

### 6. 📊 Animated Numerical Counters
- Viewport-triggered counters that smoothly count up from 0 to target metrics (`18+` projects, `650+` CAD modeling hours, `8+` hardware platforms, `5` awards).

### 7. 📋 HUD Telemetry Copy Feedback
- Interactive one-click copy buttons for email address, telephone line, and IEEE paper DOIs with instant floating HUD toast alerts.

### 8. ♿ Accessible & Reduced-Motion Respectful
- Fully honors `prefers-reduced-motion: reduce`: heavy parallax, continuous rotations, and scale animations cleanly collapse into instantaneous transitions.

---

## 🛠️ Technology Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Presentation                       │
│  React 19.2 • TypeScript 6.0 • Vite 8.2 • Tailwind CSS 3.4      │
├───────────────────────────────┬─────────────────────────────────┤
│       Interaction & Motion    │        Engineering Systems      │
│  • Lenis Smooth Scroll        │  • CAD Filesystem Service       │
│  • Framer Motion & CSS Transforms│  • In-Browser Project Runtime  │
│  • Dual-Ring Physics Cursor   │  • S3 CAD Assets Storage        │
│  • rAF 3D Perspective Tilt    │  • Zip Extraction & File Tree   │
├───────────────────────────────┴─────────────────────────────────┤
│                        Runtime / Backend                        │
│         Express 4.21 • Node.js • Multi-Zip File Server          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Dependencies

| Library | Version | Purpose |
|---|---|---|
| `react` / `react-dom` | `^19.2.8` | Core component architecture |
| `react-router-dom` | `^7.18.2` | Single-page client routing & deep-links |
| `lenis` | `^1.3.26` | Inertial 60fps smooth scrolling engine |
| `framer-motion` | `^12.x` | Physics orchestration and layout animations |
| `lucide-react` | `^1.34.0` | Clean, modern engineering iconography |
| `tailwindcss` | `^3.4.19` | Design tokens, CAD grid utilities, and responsive breakpoints |
| `express` | `^4.21.2` | Local server for runtime unpacking and CAD inspection |

---

## 📂 Project Structure

```
├── public/                     # Static assets, hero art, CAD thumbnails & resume.pdf
├── server/                     # Express runtime server for project ZIP and CAD serving
│   └── index.js                # API endpoints for ZIP uploads, extraction & S3
├── src/
│   ├── admin/                  # Protected CMS portal for managing portfolio content
│   │   ├── components/         # Admin layout, CAD uploader, ZIP manager, modals
│   │   └── pages/              # Project editor, CAD manager, profile editor, settings
│   ├── assets/                 # Icons, SVG vectors, branding
│   ├── components/
│   │   ├── common/             # Reusable UI primitives:
│   │   │   ├── Badge.tsx       # Status & category pills
│   │   │   ├── Button.tsx      # Micro-animated interactive buttons
│   │   │   ├── Card.tsx        # Glassmorphic card primitive
│   │   │   ├── Counter.tsx     # Viewport numerical counter with easing
│   │   │   ├── Magnetic.tsx    # Magnetic physics cursor attractor
│   │   │   ├── ProjectQuickViewModal.tsx # In-page case study viewer
│   │   │   ├── SectionHeader.tsx # Standardized typography header
│   │   │   ├── TechBadge.tsx   # Hardware & firmware tech stack badges
│   │   │   └── Toast.tsx       # HUD notification toast alert
│   │   ├── layout/             # Global layout & chrome:
│   │   │   ├── CustomCursor.tsx # Dual-ring physics cursor with state machine
│   │   │   ├── Footer.tsx      # Engineering telemetry footer
│   │   │   ├── Navbar.tsx      # Smart scroll-direction hiding frosted header
│   │   │   ├── Preloader.tsx   # Cinematic boot sequence preloader
│   │   │   └── ScrollProgress.tsx # Precision top progress indicator
│   │   └── sections/           # Modular homepage sections:
│   │       ├── AboutSection.tsx        # Profile narrative & core pillars
│   │       ├── CertificationsSection.tsx # Industry credentials & achievements
│   │       ├── CompetitionsSection.tsx # Hackathons & robotics sprints
│   │       ├── ContactSection.tsx      # Terminal gateway with copy & form
│   │       ├── EducationSection.tsx    # Degrees, GPA & advanced coursework
│   │       ├── ExperienceSection.tsx   # Interactive glowing timeline
│   │       ├── FocusAreasSection.tsx   # Mechatronics specialization domains
│   │       ├── HeroSection.tsx         # 3D holographic concentric rings & bio
│   │       ├── MechanicalSection.tsx   # CAD & DFM blueprint showroom
│   │       ├── ProjectsSection.tsx     # 3D robotics case studies
│   │       ├── PublicationsSection.tsx # IEEE papers & DOI copy
│   │       └── SkillsSection.tsx       # Filterable skills architecture matrix
│   ├── context/                # React contexts (AuthContext, PortfolioContext)
│   ├── data/                   # Default initial portfolio database
│   ├── hooks/                  # Custom hooks (useSmoothScroll, use3DTilt, useScrollSpy)
│   ├── pages/                  # Public routes (HomePage, ProjectDetail, MechanicalDetail)
│   ├── services/               # Client services (runtime, storage, cad)
│   ├── types/                  # Strict TypeScript schemas
│   ├── App.tsx                 # Root layout, routing, and provider tree
│   ├── index.css               # Design tokens, keyframes, utilities, reduced motion
│   └── main.tsx                # Client entrypoint
└── tailwind.config.js          # Theme extension with engineering color palette
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v20.19.0+` or `v22.12.0+` recommended
- **npm** or **pnpm**

### 1. Clone Repository
```bash
git clone https://github.com/kulasekarapandiankr2006/KP-Portfolio.git
cd KP-Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
To launch both Vite frontend and Express server concurrently:
```bash
npm run dev
```

Or launch the frontend independently:
```bash
npm run dev:frontend
```
The site will be running at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🔒 Admin CMS Portal

The portfolio includes an embedded CMS portal for updating profile details, adding new projects, uploading CAD models, and uploading executable ZIP project runtimes.

- **Access URL**: `/admin/login`
- **Keyboard Shortcut**: Press `Ctrl` + `Shift` + `A` from anywhere on the website.
- **Capabilities**:
  - Add/Edit robotics projects with gallery images and runnable zip packages
  - Upload SolidWorks / STEP CAD models and mechanical drawing assets
  - Edit experience timeline, academic coursework, and certifications
  - Manage live skills matrix and proficiency ratings

---

## 🌐 Recommended GitHub Repository Settings

To maximize professional reach on GitHub:

- **Repository Description**:
  > *⚡ World-class Mechatronics & Autonomous Robotics Engineering Portfolio. Features ROS 2, STM32 Bare-Metal/FreeRTOS, 3D CAD Showroom, Lenis smooth scrolling, and custom interaction design.*
- **Website URL**: Add the deployed production domain (e.g., `https://kulasekarapandian.com`)
- **Recommended Topics**:
  `robotics`, `mechatronics`, `embedded-systems`, `ros2`, `stm32`, `solidworks`, `cad`, `freertos`, `control-systems`, `foc-motor-control`, `react19`, `vite`, `typescript`, `tailwind-css`, `lenis-scroll`, `awwwards`

---

## 📬 Contact & Connect

**Kulasekara Pandian K R**  
*Mechatronics & Robotics Systems Engineer*

- **Email**: [contact@kulasekarapandian.com](mailto:contact@kulasekarapandian.com)
- **LinkedIn**: [linkedin.com/in/kulasekara-pandian-k-r](https://www.linkedin.com/in/kulasekara-pandian-k-r/)
- **GitHub**: [@kulasekarapandiankr2006](https://github.com/kulasekarapandiankr2006)

---

<div align="center">
  <sub>Engineered with precision. © 2026 Kulasekara Pandian K R. All rights reserved.</sub>
</div>
