# Design System: Codevas Interactive Learning Platform

> **North Star: "Joyful Pop & Playful Mastery"**  
> Codevas combines serious developer tools with vibrant, candy-themed gamification. The visual language feels energetic, welcoming, and modern—turning learning to code into an engaging, tactile experience without sacrificing clarity and precision.

---

## 1. Brand Identity & Aesthetic Principles

- **Playful yet Purposeful:** High saturation and bold accents are paired with clean, generous spacing so students stay focused while feeling energized.
- **Organic & Friendly Geometry:** Rounded corners, pill-shaped action badges, and friendly typography banish intimidating technical jargon.
- **Physical Tactility:** Micro-animations with subtle spring bounces (`scale(1.04)`) and tinted chromatic drop shadows give UI elements a physical, responsive feel.
- **Gamified Feedback:** Progress, streaks, and achievements are celebrated with vivid badges, XP counters, and warm glowing cues.

---

## 2. Color Palette & Design Tokens

Codevas uses the **Candy Expressive** color system based on Material 3 tonal palettes.

### 2.1 Core Brand Colors
| Role | Token / Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `primary` | `#e040a0` | Main CTA buttons, active tabs, brand logo, key highlights |
| **Primary Container** | `primary-container` | `#f080c0` | Hover states, glowing backdrops |
| **Primary Fixed** | `primary-fixed` | `#ffd6ee` | Soft badge backgrounds, tag chips |
| **On Primary** | `on-primary` | `#ffffff` | Text/icons on primary fill |
| **On Primary Fixed** | `on-primary-fixed` | `#3d0028` | Text on soft pink badges |
| **Secondary** | `secondary` | `#7c52aa` | Secondary actions, syllabus milestones, stage headers |
| **Secondary Container**| `secondary-container` | `#eedcff` | XP badges, streak pills, subtle card tints |
| **On Secondary** | `on-secondary` | `#ffffff` | Text on secondary buttons |
| **Tertiary** | `tertiary` | `#0096cc` | Live preview sync, informational links, code variables |
| **Tertiary Container** | `tertiary-container` | `#40c0ee` | Highlight callouts, active state indicators |
| **Tertiary Fixed** | `tertiary-fixed` | `#c8eaff` | Soft cyan badges, info banners |

### 2.2 Semantic & Accent Colors
| Role | Hex Code | Description & Usage |
| :--- | :--- | :--- |
| **Success** | `#27c93f` | Successful test runs, completed tasks, green traffic light |
| **Warning / XP** | `#ffb703` | Stars, streak flame icons, caution alerts |
| **Error** | `#e53e3e` | Syntax errors, failed tests, reset button hover |
| **Error Container** | `#ffe8e8` | Error banner backgrounds |
| **Window Traffic** | Red `#ff5f56`, Yellow `#ffbd2e`, Green `#27c93f` | macOS-style mockup chrome |

### 2.3 Surface & Neutral Hierarchy (Light Mode Default)
| Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `background` | `#fef7ff` | App canvas background (warm off-white pink) |
| `surface` | `#fef7ff` | Base surface, headers, modals |
| `surface-container-lowest` | `#ffffff` | Code editor background, preview canvas card |
| `surface-container-low` | `#fbf2fb` | Workspace main layout container |
| `surface-container` | `#f8eef8` | Sub-toolbars, navigation rails, input containers |
| `surface-container-high`| `#f2e8f2` | Card hover states, secondary chips |
| `surface-container-highest`| `#ece2ec`| Inactive borders, dividers |
| `outline` | `#907898` | Active borders, icons, secondary labels |
| `outline-variant` | `#dcc8e0` | Subtle borders, split pane dividers |
| `on-surface` | `#2e1a28` | High-contrast body text, headings |
| `on-surface-variant` | `#604868` | Subdued text, metadata, hints |

---

## 3. Typography Hierarchy

Codevas uses **DM Sans** for all UI surfaces and **JetBrains Mono** for technical/code components.

### 3.1 Font Families
- **Display & Headings:** `DM Sans, -apple-system, BlinkMacSystemFont, sans-serif`
- **Body & Labels:** `DM Sans, sans-serif`
- **Code & Sandbox:** `JetBrains Mono, Menlo, monospace`

### 3.2 Scale & Styles
| Level | Font Family | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | DM Sans | `36px / 44px` (2.25rem) | Bold (700) / Black (900) | `-0.02em` | Landing page hero, level clear |
| **H1** | DM Sans | `28px / 36px` (1.75rem) | Bold (700) | `-0.015em` | Page titles, syllabus module names |
| **H2** | DM Sans | `22px / 28px` (1.375rem) | SemiBold (600) | `-0.01em` | Section headers, card titles |
| **H3** | DM Sans | `18px / 24px` (1.125rem) | SemiBold (600) | `normal` | Modal titles, quiz questions |
| **Body (Default)** | DM Sans | `15px / 22px` (0.9375rem) | Regular (400) | `normal` | Explanations, instructions |
| **Body Small** | DM Sans | `13px / 18px` (0.8125rem) | Medium (500) | `normal` | Metadata, breadcrumbs, hints |
| **Label / Action** | DM Sans | `13px / 16px` (0.8125rem) | Bold (700) | `0.01em` | Buttons, badges, tabs, pills |
| **Code Editor** | JetBrains Mono | `13px / 20px` (0.8125rem) | Regular (400) / SemiBold | `normal` | Code lines, terminal output, URLs |

---

## 4. Shapes, Elevation & Spacing

### 4.1 Border Radius System
- **Pill (`9999px` / `rounded-full`):**
  - Action buttons (`Run Code`, `Submit Quiz`, `Dashboard`)
  - Badges, status pills (`Live Sync: ON`, `1,240 XP`)
  - Form inputs and search bars
  - Breadcrumbs & tag chips
- **Large Container (`16px-24px` / `rounded-2xl`):**
  - Workspace preview frame & code editor container
  - Syllabus modules & lesson cards
  - Auth dialog cards
- **Medium Elements (`10px-12px` / `rounded-xl`):**
  - Interactive playground candy blocks
  - Modal content cards & hint boxes

### 4.2 Elevation & Tinted Shadows
Instead of generic grey shadows, Codevas utilizes saturated, tinted shadows that match the component's hue:

```css
/* Candy Glow Drop Shadows */
.candy-shadow-pink {
  box-shadow: 0 8px 24px -4px rgba(224, 64, 160, 0.28);
}

.candy-shadow-purple {
  box-shadow: 0 8px 24px -4px rgba(124, 82, 170, 0.25);
}

.candy-shadow-blue {
  box-shadow: 0 8px 24px -4px rgba(0, 150, 204, 0.25);
}

/* Subtle Card Elevation */
.card-elevation {
  box-shadow: 0 4px 20px -2px rgba(124, 82, 170, 0.08);
}
```

### 4.3 Background Patterns
- **Blueprint Sandbox Grid:**
  ```css
  .blueprint-grid {
    background-size: 24px 24px;
    background-image: 
      linear-gradient(to right, rgba(124, 82, 170, 0.07) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(124, 82, 170, 0.07) 1px, transparent 1px);
  }
  ```

---

## 5. Component Specifications

### 5.1 Buttons
- **Primary CTA:**
  - Shape: Full pill (`rounded-full`)
  - Fill: `#e040a0` (`primary`) with text `#ffffff` (`on-primary`)
  - Shadow: `0 4px 16px rgba(224, 64, 160, 0.35)`
  - Hover: `transform: scale(1.04)`, deeper glow
  - Active: `transform: scale(0.96)`
- **Secondary / Ghost Pill:**
  - Fill: `#f2e8f2` (`surface-container-high`) or transparent with border `#dcc8e0`
  - Text: `#604868` (`on-surface-variant`)
  - Hover: Background `#f8eef8`, text `#2e1a28`
- **Icon Action Buttons (Reset, Close, Refresh):**
  - Circular (`w-8 h-8 rounded-full`), subtle border, hover state shifts to contextual tint (e.g., `#ffe8e8` with red icon for Reset).

### 5.2 Badges & Metric Pills
- **XP Capsule:** Pill badge with `#eedcff` background, `#7c52aa` text, and a flame icon (`#ffb703`).
- **Stage Indicator:** Multi-segment pill showing stage title, separator dot, and current task count (e.g. `Stage 1: Flexbox Fundamentals • Task 2/3`).

### 5.3 Live Coding Workspace
- **Layout Split:**
  - **Left Panel (55%):** Interactive Preview Browser
    - macOS traffic control dots (Red, Yellow, Green)
    - URL bar capsule (`codevas.local/preview`) with lock indicator and viewport dimensions
    - Blueprint grid canvas featuring dynamic reactive components
  - **Right Panel (45%):** Mission Control & Code Editor
    - Active file tab bar (`style.css`, `index.html`)
    - Monaco-style code editor with gutter line numbers, syntax highlighting, and auto-indent
    - Bottom drawer with Task Instructions, Hints, and "Run Test" trigger

### 5.4 Live Code Quiz (Fill-in-the-Blank)
- Highlighted code snippet with inline pill input fields:
  ```html
  <span class="inline-block px-3 py-1 mx-1 bg-surface-container rounded-full border border-primary/40 text-primary font-mono font-bold">
    justify-content: [ center ]
  </span>
  ```
- Instant visual validation with animated confetti or shake state.

---

## 6. Microinteractions & Motion

- **Spring-like Hover Scale:**
  - `transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Applies to all cards, candy blocks, and action buttons.
- **Active State Squeeze:**
  - `transform: scale(0.95)` on click/tap to simulate tangible physical buttons.
- **Status Pulses:**
  - Live preview syncing indicator features an animated green dot (`animate-pulse`).

---

## 7. Tailwind CSS Configuration Guide

Integrate the Codevas design tokens into `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e040a0",
          container: "#f080c0",
          fixed: "#ffd6ee",
          "fixed-dim": "#f0a0cc",
        },
        secondary: {
          DEFAULT: "#7c52aa",
          container: "#eedcff",
          fixed: "#eedcff",
          "fixed-dim": "#c8a8e8",
        },
        tertiary: {
          DEFAULT: "#0096cc",
          container: "#40c0ee",
          fixed: "#c8eaff",
          "fixed-dim": "#80d0f0",
        },
        surface: {
          DEFAULT: "#fef7ff",
          dim: "#e0d6e0",
          bright: "#fef7ff",
          variant: "#f2e8f2",
          container: "#f8eef8",
          "container-low": "#fbf2fb",
          "container-high": "#f2e8f2",
          "container-highest": "#ece2ec",
          "container-lowest": "#ffffff",
        },
        outline: {
          DEFAULT: "#907898",
          variant: "#dcc8e0",
        },
        "on-surface": {
          DEFAULT: "#2e1a28",
          variant: "#604868",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#2e1a28",
          fixed: "#3d0028",
          "fixed-variant": "#a02070",
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#2e2040",
          fixed: "#1a1030",
          "fixed-variant": "#4a3068",
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#00334d",
          fixed: "#001a33",
          "fixed-variant": "#005580",
        },
        error: {
          DEFAULT: "#e53e3e",
          container: "#ffe8e8",
        },
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-dm-sans)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        label: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        "candy-pink": "0 8px 24px -4px rgba(224, 64, 160, 0.28)",
        "candy-purple": "0 8px 24px -4px rgba(124, 82, 170, 0.25)",
        "candy-blue": "0 8px 24px -4px rgba(0, 150, 204, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 8. Summary of Project Screens
The Codevas Stitch project (`597856930213029591`) encompasses 9 synchronized views:

1. **Landing Page (`80611f6d25b7468f8806056b25ae800c`):** High-converting introduction with hero playground teaser, feature pillars, and testimonials.
2. **Authentication - Login (`5f58792ca79741f19f22e948d4d5cf4e`):** Friendly, rounded form with social login and password recovery.
3. **Authentication - Register (`a860d9af7f36450c98443b9214aada9b`):** Gamified onboarding asking for student goals and avatar selection.
4. **Auth Hub (`cd114cc3066648558d5d7c73655e59e9`):** Combined tabbed authentication view.
5. **Class & Quiz Catalog (`16516e2fc77b4f41840a6bd0f7da5f7a`):** Filterable grid of interactive learning paths (HTML, CSS Flexbox, JavaScript, React).
6. **Class Detail & Syllabus (`31aaf82f5df94fc58fbb758f687746da`):** Course progress tree, milestones, estimated time, and reward badges.
7. **The Workspace - Live Coding (`94239eaf76b04ad9aa16ab8a9673252c`):** Split-view IDE with Monaco editor, live sandbox, and real-time execution.
8. **Live Code Quiz (`c00c16128834472bae7522f70195251b`):** Fill-in-the-blank interactive syntax challenges.
9. **Learning Hub & Pre-Flight Modal (`06431acb9b8b454e87b4784e45feaea5`):** Mission briefing before launching into a challenge.
