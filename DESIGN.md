# Design System Document: HD Construction Digital Interface

## 1. Overview & Creative North Star: "The Architectural Blueprint"
The design system for HD Construction is rooted in the concept of **Architectural Blueprinting**. It moves beyond the generic "SaaS dashboard" by treating the digital interface as a physical construction site: structured, layered, and authoritative. 

The Creative North Star is **Structural Sophistication**. We achieve this by moving away from "boxy" layouts and instead using intentional asymmetry, generous breathing room (white space), and a high-contrast editorial typography scale. The interface should feel as solid and premium as a luxury high-rise, utilizing "Tonal Depth" rather than traditional borders to define space.

---

## 2. Colors & Surface Logic
The palette is a high-contrast interplay between deep, nocturnal slates and a vibrant, energetic orange.

### Surface Hierarchy & Nesting
To move beyond a "template" look, we forbid the use of flat grids. Instead, use a **Stacking Logic**:
- **Base Layer:** `surface` (#0b1326) – The bedrock of the application.
- **Sectioning:** `surface_container_low` (#131b2e) – Used for large sidebar or background regions.
- **Actionable Cards:** `surface_container` (#171f33) – The standard container for content.
- **Elevated Modals/Popovers:** `surface_container_highest` (#2d3449) – To bring urgent information to the literal forefront.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off major areas. Boundaries must be defined by shifts in background tokens (e.g., a `surface_container` card sitting on a `surface` background). If a visual separator is needed, use the **Spacing Scale** (token `8` or `10`) to create a "void" that defines the edge.

### The "Glass & Gradient" Rule
Main CTAs and Hero accents should use a linear gradient: `primary` (#ffb690) to `primary_container` (#f97316) at a 135-degree angle. This adds "soul" and depth. For floating navigation or filters, use **Glassmorphism**: `surface_variant` with a 60% opacity and a 12px backdrop-blur.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance industrial precision with modern readability.

*   **Display & Headlines (Manrope):** Used for data visualization titles and page headers. The geometric nature of Manrope mirrors architectural drafting.
    *   `display-lg`: 3.5rem (Use for "Big Number" hero stats).
    *   `headline-md`: 1.75rem (Page titles).
*   **Body & Labels (Inter):** Highly legible and neutral, allowing the construction data to take center stage.
    *   `title-md`: 1.125rem (Card titles).
    *   `body-md`: 0.875rem (Standard data entry/reading).
    *   `label-sm`: 0.6875rem (Uppercase, tracked out +5% for status labels).

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0" for a premium construction brand. We use **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" container tiers. A `surface_container_low` sidebar sits next to a `surface` main content area. This creates a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a context menu) requires a shadow, it must be the "Ambient" style: `box-shadow: 0 20px 40px rgba(6, 14, 32, 0.4)`. It should feel like a soft glow of darkness, not a hard shadow.
*   **The Ghost Border:** For accessibility in form fields, use a `1px` border of `outline_variant` at **20% opacity**. This provides a guide without cluttering the minimalist aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Corner radius: `xl` (1.5rem). Text: `label-md` (Bold).
*   **Secondary:** `surface_container_highest` background with `primary` text. No border.
*   **Tertiary:** Transparent background, `on_surface_variant` text. High-contrast hover state using `surface_bright`.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Use a vertical spacing of `4` (1.4rem) between list items. Use a subtle background shift (`surface_container_low`) on hover to indicate interactivity.
*   **Cards:** Always use `rounded-xl` (1.5rem). High-priority cards should feature a 4px left-accent bar in `primary` or a status color (`emerald`, `amber`, etc.).

### Input Fields
*   **Style:** `surface_container_lowest` background. 
*   **State:** On focus, the "Ghost Border" becomes 100% opaque `primary`. 
*   **Helper Text:** Use `label-sm` in `on_surface_variant`.

### Construction-Specific Components
*   **Status Indicators:** Not just dots—use "High-Contrast Lozenge" shapes. A pill-shaped background at 15% opacity of the status color (e.g., `emerald`) with a solid-color label.
*   **Progress Gauges:** Use heavy-weight strokes (8px+) for circular project completion trackers to mirror the "heavy machinery" feel.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. For example, a wide 2/3 column for a site map and a narrow 1/3 column for project alerts.
*   **Do** use `rounded-xl` consistently. The "HD Construction" look is modern and friendly, not sharp and aggressive.
*   **Do** utilize `surface_bright` (#31394d) for hover states on dark surfaces to create a "lit from within" effect.

### Don’t
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Use the provided Slate and Light Gray scales to maintain tonal depth.
*   **Don't** use 1px dividers. If you feel the need for a line, use a 4px gap of whitespace instead.
*   **Don't** cram data. If a dashboard view feels tight, move secondary metrics into a "Drawer" using the `surface_container_highest` token.