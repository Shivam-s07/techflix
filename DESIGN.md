# Design System Strategy: Hyper-Electric Velocity

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Hyper-Electric Velocity."** 

This is not a static dashboard; it is a living, breathing digital twin of a city in motion. We are moving away from the "static widget" aesthetic of traditional SaaS and toward a high-performance, low-latency HUD (Heads-Up Display) experience. The goal is to capture the raw energy of urban transit through intentional asymmetry, overlapping data layers, and a sense of "digital frictionlessness." 

By prioritizing motion-oriented layouts and eliminating rigid containment lines, we create an atmosphere of high-speed efficiency. The interface should feel as though it is projected rather than printed—a luminous, data-rich environment where every pixel is powered by the city's pulse.

---

## 2. Colors & Surface Philosophy
The palette is rooted in `surface_dim` (#050505), creating an "Obsidian Deep" canvas that allows vibrant data streams to pop with maximum contrast.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited. In this system, boundaries are defined by light and depth, not lines. 
- Use **Background Shifts**: Separate sections by transitioning from `surface` to `surface_container_low`.
- Use **The Glow Fallback**: Instead of a stroke, use a 1px inner shadow or a subtle outer bloom using `primary` (#cc97ff) at 15% opacity to define the "edge" of a container.

### Surface Hierarchy & Nesting
We treat the UI as a series of stacked, energized plates.
- **Base Layer:** `surface` (#0e0e0e) – The city grid.
- **Navigation/Control Layers:** `surface_container_low` (#131313) – Recessed utilities.
- **Active Data Modules:** `surface_container` (#1a1919) – Standard interaction zones.
- **Pop-overs/Critical Alerts:** `surface_bright` (#2c2c2c) – Maximum visibility.

### The "Glass & Gradient" Rule
To achieve the "Hyper-Electric" feel, all floating modules must utilize Glassmorphism.
- **Formula:** `surface_container` + 5% white opacity overlay + 20px Backdrop Blur.
- **Signature Texture:** Use a linear gradient for primary actions: `primary` (#cc97ff) to `primary_dim` (#9c48ea) at a 135-degree angle. This creates a "moving light" effect that mimics speed.

---

## 3. Typography: Data vs. Command
The typography creates a hierarchy between the "Machine" (Headers) and the "Information" (Data).

- **Headers (Orbitron):** Used for `display` and `headline` scales. Orbitron’s geometric, futuristic architecture signals authority and system-level commands. It should feel like a digital readout.
- **Data & Interaction (Inter):** Used for `title`, `body`, and `label` scales. Inter provides the high-performance legibility required for low-latency decision-making.

**Editorial Tip:** Use `display-lg` for single, massive KPIs (e.g., "98% Efficiency") to break the grid and create a "poster-style" data visualization that feels premium and intentional.

---

## 4. Elevation & Depth
In a "Hyper-Electric" environment, depth is synonymous with energy.

- **Tonal Layering:** Avoid drop shadows for standard cards. Instead, use "Nested Lifts." A `surface_container_high` card sitting on a `surface_container_low` background creates a sophisticated, soft-touch elevation.
- **Ambient Glows:** When an element must "float" (e.g., a modal), use an ambient shadow: 40px Blur, 0px Offset, 8% opacity of `primary` (#cc97ff). This mimics the neon glow of a city at night.
- **The Ghost Border:** If a container needs higher definition, use the `outline_variant` token at 10% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons (Velocity Triggers)
- **Primary:** Gradient fill (`primary` to `primary_dim`). No border. `xl` (0.75rem) roundedness. 
- **Secondary:** Glassmorphic background with a `primary` "Ghost Border" (20% opacity).
- **Tertiary:** Pure text using `primary_fixed` with a subtle hover glow.

### Chips (Transit Nodes)
- Used for filtering transit types (e.g., Rail, Bus, EV). 
- **Style:** `surface_container_highest` background with `on_surface_variant` text. When active, the text switches to `primary` and gains a 2px "Electric Violet" bottom-glow.

### Input Fields (Data Entry)
- **Style:** Semi-transparent `surface_container_lowest`. 
- **Focus State:** The container background remains dark, but the "Ghost Border" increases to 40% opacity of `primary`, and the cursor assumes the `primary` color.

### Cards & Lists (The Grid-Breakers)
- **Forbid Dividers:** Do not use lines between list items. Use 12px of vertical `body-sm` whitespace.
- **Micro-interactions:** On hover, a card should shift from `surface_container` to `surface_container_high` and scale by 1.02x to simulate "velocity" coming toward the user.

### High-Performance Components
- **The "Pulse" Indicator:** A small `secondary` (Emerald Spark) dot with a radiating CSS animation to show real-time system health.
- **The Flow-Line:** A 2px thick path using `primary_dim` with a "marching ants" dash-array effect to visualize transit flow.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Asymmetry:** Let a map occupy 65% of the screen while data modules stack on the right. High-end editorial design avoids 50/50 splits.
- **Use "Flow" Colors:** Use `primary` (#A855F7) for anything in motion and `secondary` (#10B981) for anything stable.
- **Maximize Blur:** Ensure backdrop blurs are heavy (20px+) to maintain legibility over complex city maps.

### Don't:
- **Don't use pure white:** All "white" text should actually be `on_surface` or `on_background` (slightly off-white) to prevent eye strain in dark environments.
- **Don't use solid borders:** Never use a 100% opaque stroke to define a shape. It kills the "Hyper-Electric" energy.
- **Don't crowd the data:** High-performance doesn't mean "cluttered." Use the `xl` (0.75rem) spacing scale to let the "Obsidian Deep" background breathe.