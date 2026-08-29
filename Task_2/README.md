# E-Cell UIET Kurukshetra Web Portal

A premium, interactive, and visually stunning landing page for the **Entrepreneurship Cell of UIET, Kurukshetra University**. This project showcases modern front-end web design practices using glassmorphism, responsive grids, canvas-based ambient animations, and scroll-driven interactivity.

---

## 🚀 Live Demo / Visual Overview

* **Design Concept:** Sleek, high-tech dark theme incorporating glowing accents and smooth visual flows to capture the innovation-focused spirit of an entrepreneurship cell.
* **Fonts:** Styled with modern typography from Google Fonts:
  * **Headings:** [Outfit](https://fonts.google.com/specimen/Outfit) (ranging from 300 Light to 900 Black)
  * **Body Copy:** [Inter](https://fonts.google.com/specimen/Inter) for clean legibility
* **Accents:** A custom color palette blending neon blue, purple, cyan, and deep surface colors.

---

## ✨ Features & Interactive Elements

This project contains several custom components designed to optimize performance and elevate user engagement:

### 1. Animated Canvas Circuit Grid (`#global-grid`)
* **How it works:** A background canvas renders a responsive grid structure overlaying a starry layout. Ambient dot markers pulse at intersections.
* **Light Pulse Traces:** Glowing energy packets randomly travel along the grid axes with realistic fading tails.
* **Scroll-Driven Color Shifting:** As the user scrolls, the grid's color profile (`gridAccent`) dynamically interpolates between section themes (e.g., Electric Blue ➔ Neon Purple ➔ Cyber Cyan) for a seamless journey through different sections.

### 2. Battery-Friendly Hero Particle System (`#particle-canvas`)
* **How it works:** Renders interactive, connected node-dots behind the hero text.
* **Optimization:** Using the `IntersectionObserver` API, the animation loop stops automatically when the hero section scrolls out of view. This minimizes CPU/GPU overhead on client devices.

### 3. Scroll Reveal & Staggered Animations (`.reveal`)
* **How it works:** Content fades and translates upward smoothly as it enters the viewport.
* **Staggered Delays:** Grids for cards (About, Events, Team) are configured with custom CSS animation delays (e.g., 0ms ➔ 80ms ➔ 160ms) to create a premium staggered entrance.

### 4. Interactive Statistics Counter (`.stat-num`)
* **How it works:** Numbers representing key metrics (200+ Members, 50+ Startups, 30+ Events) trigger a count-up animation utilizing a custom **cubic ease-out curve** the moment they become visible on screen.

### 5. Responsive Glassmorphic Layouts
* **Navigation:** A modern floating header that transitions from transparent to blurred glass (`backdrop-filter`) on scroll. Includes a fully animated mobile hamburger menu.
* **Cards & Forms:** Unified styling with semi-transparent backgrounds, subtle borders, and vivid hover states.

---

## 📂 Project Architecture

```bash
/project_2
├── README.md          # Project documentation (this file)
├── custom.css         # Keyframe animations, staggered transitions, custom scrollbars, section bleed fades
├── ecell_logo.png     # Brand logo asset (transparent background)
├── hero_bg.png        # Subdued layout image for the hero section
├── index.html         # Main entry point with Tailwind CDN and custom HTML5 layout
├── script.js          # Interactive systems (Canvas loops, reveal observers, forms, counter animation)
├── style.css          # Alternate legacy stylesheet containing a pure-CSS design system layout
└── video_2.mp4        # Interactive promotional video asset
```

---

## 🛠️ Tech Stack

* **Structure:** HTML5 Semantic Elements (`<nav>`, `<section>`, `<article>`, `<canvas>`)
* **Logic:** ES6+ JavaScript (Modular Canvas API, Intersection Observers, Animation Frames)
* **Styling:** Tailwind CSS CDN (enhanced with custom configuration overrides) & Vanilla CSS for animations

---

## ⚡ Getting Started

### Prerequisites
No compilation, build steps, or local dependencies are required to run this static website.

### Run Locally
1. Clone or download this project folder.
2. Open `index.html` directly in any modern web browser (Chrome, Safari, Firefox, Edge, etc.).
3. **Recommended:** For the best experience (and to prevent potential local CORS issues with canvas asset draws), run the project via a local web server:
   * Using VS Code: Right-click `index.html` and select **Open with Live Server**.
   * Using Python (via terminal):
     ```bash
     python3 -m http.server 8080
     ```
     Then open `http://localhost:8080` in your browser.
   * Using Node.js/npm:
     ```bash
     npx serve .
     ```

---

## ✍️ Code Contributors
* Developed as part of the E-Cell UIET Kurukshetra digital interface suite.
