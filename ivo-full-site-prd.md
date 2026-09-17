# PRD: IVO Portfolio Site — Full Platform
**Studio:** IVO
**Owner:** Inioluwa Oladipupo
**Status:** Draft
**Last updated:** September 15, 2026

---

## 1. Summary

A personal portfolio website for IVO (Inioluwa Oladipupo), a student architect, that showcases work, supports easy self-service content updates through a CMS, and includes a set of differentiating features (including 3D navigation) to stand out among student architecture portfolios.

## 2. Goals

- Present architectural work professionally and memorably to recruiters, reviewers, and peers.
- Let the owner update content (new projects, bio, resume) without touching code.
- Include a few genuinely useful "cool" features that reinforce the studio's spatial/design identity rather than being gimmicks.
- Stay fast, accessible, and easy to maintain long-term (student timeline/budget).

## 3. Non-Goals

- E-commerce or client billing features.
- Multi-user/team accounts (this is a single-owner site).
- Native mobile app.

## 4. Target Users

- **Primary:** Recruiters, studio principals, academic reviewers viewing the public site.
- **Secondary:** Inioluwa (site owner), managing content via the CMS.

## 5. Site Structure / Core Pages

- **Home** — hero intro, entry point (potentially the 3D scene).
- **About/Bio** — background, education, design philosophy, photo.
- **Projects** — gallery of work; each project has its own detail page.
- **Resume/CV** — viewable on-page (no download); full details presented in-browser instead of a PDF file.
- **Contact** — contact form + social/professional links.

## 6. CMS Requirements

### 6.1 Content Management
- Owner can add/edit/remove **projects** without code: title, description, category/tags, images or 3D model files, year, role, tools used.
- Owner can edit **About/Bio** text and photo.
- Owner can update the **resume/CV** content directly in the CMS (displayed on-page, not offered as a downloadable file).
- Owner can reorder projects (e.g., drag-and-drop or a simple order field) to control gallery sequence.

### 6.2 Media Handling
- Support image upload with automatic optimization/resizing for web.
- Support upload of 3D model files (e.g., .glb/.gltf) for projects that want an embedded 3D viewer.
- Support video embeds (e.g., walkthroughs, animations) via file upload or link (YouTube/Vimeo).
- Require a cover/poster image for every 3D model and video so the project remains usable before media loads.
- Define maximum file sizes and use Draco or Meshopt compression for production 3D models where practical.

### 6.3 Access & Workflow
- Single-owner authenticated access to the CMS (no public sign-up).
- Draft vs. published state per project, so unfinished work isn't publicly visible.
- Simple preview of a project before publishing.

### 6.4 Technical Approach
- **Chosen CMS: Sanity** (headless CMS) feeding a custom front end — supports the site's image and 3D-file (.glb) heavy content, offers a generous free tier suited to a solo portfolio, and doesn't require self-hosting.

### 6.5 Project Content Model

Each project should support the following fields:

- Title and URL slug
- Short summary and full case-study description
- Year, project type, location, scale, and status
- Owner's role, collaborators, and credits
- Tools and techniques
- Cover image and ordered media gallery
- Process images, drawings, video, and optional 3D model
- Featured flag and display order
- SEO title, description, and social preview image
- Draft, published, or archived state

## 7. "Cool" Differentiating Features (candidates)

### 7.1 3D Navigable Site (see dedicated PRD: `ivo-3d-navigation-prd.md`)
Camera-controlled 3D environment as an alternate way to explore the site, with a flat fallback.

### 7.2 Embedded 3D Model Viewer per Project
Interactive, rotatable 3D model (massing study, building model) inside a project's detail page — visitors can orbit/zoom a model instead of only viewing static renders.

### 7.3 Before/After or Process Slider
For projects with a design evolution (concept sketch → final render), a draggable slider or scrubber showing the progression.

### 7.4 Site Plan / Location Map
An interactive map showing where each project is sited (useful for site-specific studio work), letting visitors filter projects by location.

### 7.5 Filterable Project Gallery
Filter/sort projects by type (residential, urban, conceptual, academic vs. professional), year, or scale.

### 7.6 Print-Friendly Project View
Per project, a clean print/PDF-style on-screen layout (boards + drawings) reviewers can view or print directly from the browser — no downloadable file offered.

### 7.7 Dark/Light Mode Toggle
Since the base style is dark/modern, an optional light mode for print-friendly or accessibility preference.

### 7.8 Case-Study Format for Each Project
Structured storytelling per project: brief → concept → process → outcome — rather than just an image dump, to show design thinking (valuable for reviewers).

### 7.9 Sketch/Process Gallery
A separate, lower-key section for sketches, models, and process work — distinct from polished final renders — showing range and process.

## 8. Technical Decisions

- **3D viewer and 3D navigation will share the same underlying tech: Three.js**, used for both the per-project embedded model viewer (Phase 1) and the full 3D navigation scene (Phase 3). This trades a slightly heavier setup for the per-project viewer in exchange for a single reusable rendering/camera/lighting system, visual consistency between the two features, and the ability to reuse actual project models directly inside the navigation scene later.
- The flat site is the primary navigation experience. The 3D environment is an optional enhancement and must never be required to reach content.
- Every 3D feature must provide a static image fallback, reduced-motion behavior, keyboard-accessible controls where applicable, and a usable experience when WebGL is unavailable.
- 3D models must be lazy-loaded and excluded from the initial page payload until the viewer is requested or enters the viewport.

## 9. Security & Copyright / IP Protection

### 9.1 Site & Data Security
- HTTPS enforced site-wide (no mixed content).
- CMS admin access protected by strong authentication (e.g., password + optional 2FA); no public sign-up.
- Rate-limiting / basic bot protection on the contact form to prevent spam and abuse.
- Input sanitization/validation on all forms (contact form, any CMS inputs) to prevent injection attacks.
- Regular backups of CMS content and uploaded media (projects, resume, images, 3D models).
- Dependencies/CMS platform kept up to date to avoid known vulnerabilities.
- Least-privilege access: only the owner has publish/edit rights; no third party has standing access to the CMS.

### 9.2 Copyright & IP Protection for Portfolio Content
- Visible copyright notice in the site footer (e.g., "© 2026 Inioluwa Oladipupo. All rights reserved.") asserting ownership of all original work shown.
- Optional watermarking on preview/thumbnail images of projects (especially renders and drawings) to discourage unauthorized reuse, while keeping full-resolution files private or download-gated.
- Right-click / drag-save image protection can be added as a mild deterrent, but should not be relied on as real security — determined users can bypass it, and it can hurt accessibility/UX if applied too aggressively. Use sparingly, if at all.
- Clear attribution for any content that isn't 100% original (e.g., collaborative studio work, group projects) — credit collaborators/instructors where due, and don't claim sole authorship of shared work.
- If any project uses third-party assets (stock textures, fonts, site photography not the owner's own), confirm licensing permits web display before publishing.
- Consider adding simple Terms of Use / copyright page clarifying that project images/drawings may not be reproduced, distributed, or used commercially without permission.
- No downloadable files are offered anywhere on the site (resume, drawings, models) — all content is view-only in the browser, which naturally limits unauthorized redistribution of full-resolution assets.

### 9.3 Privacy
- Contact form data (name, email, message) should only be used to respond to inquiries — no third-party sharing, and a short note to that effect near the form builds trust.
- If analytics are added later, use privacy-conscious tooling and disclose it (e.g., a simple privacy note), rather than heavy third-party tracking.

## 10. Accessibility & Performance

- WCAG-conscious contrast and keyboard navigation, especially given the dark theme and any 3D features.
- Reduced-motion support; auto-fallback from 3D/animated features when preferred.
- Fast load times — lazy-load heavy media (3D models, large images, video).
- Fully responsive across desktop, tablet, and mobile.

### 10.1 Acceptance targets

- Lighthouse Performance score of 90 or higher on core pages where practical.
- Largest Contentful Paint under 2.5 seconds on a typical mobile connection.
- No critical automated accessibility violations.
- All primary navigation and form controls usable by keyboard.
- Reduced-motion mode disables non-essential animation and 3D transitions.
- A visitor can reach every core page without loading the 3D experience.
- Images, video, and 3D models are lazy-loaded and do not create avoidable layout shift.

## 10.2 SEO

- Unique page title and meta description for every core page and project.
- Clean, stable project URLs and canonical links.
- Open Graph and social preview images.
- Sitemap and robots configuration.
- Structured data for the person, studio, and creative projects where appropriate.

## 10.3 Contact workflow

- Use a transactional email provider or server-side form handler rather than exposing email credentials in the client.
- Validate name, email, and message fields on both client and server.
- Include rate limiting or bot protection, clear success/error states, and a short privacy notice.
- Define the data-retention policy for submitted messages.

## 11. Success Metrics

- Owner can publish a new project end-to-end without developer help.
- Owner can publish a complete project in under 10 minutes after media is prepared.
- Site meets the performance and accessibility targets in Section 10.1.
- A reviewer can reach a project, resume, and contact method within two interactions from the home page.
- Positive feedback from reviewers/recruiters on distinctiveness and usability.

## 12. Open Questions

- How aggressively should image-protection measures (watermarking, download gating) be applied without hurting usability?
- Will a downloadable, optimized PDF resume be offered alongside the on-page resume for recruiter workflows?
- Which projects have production-ready 3D models suitable for public web delivery?
- Which contact-form provider and analytics approach will be used?

## 13. Hosting & Domain

- **Hosting: Vercel** — fits the site's modern JS stack, 3D/media-heavy content, and integrates with an automatic deploy workflow from the code repository.
- **Domain: ivostudio.com.ng** — registered.
- **Email: inioluwa@ivostudio.com.ng** via Zoho Mail (free plan) — custom-domain inbox connected through DNS records (TXT verification + MX records) added at the domain registrar.

## 14. Proposed Phasing

- **Phase 1 (MVP):** Core pages (Home, About, Projects, Resume, Contact), Sanity CMS for projects/bio/resume, case-study project format, responsive image handling, basic filtering, SEO foundation, contact workflow, accessibility, performance, and flat navigation.
- **Phase 2:** Embedded 3D model viewer per project, process/sketch gallery, video embeds, print-friendly project views, and advanced filtering.
- **Phase 3:** 3D navigation (per separate PRD), site/location map, optional light mode, and advanced spatial interactions.

## 15. Launch checklist

- Final project content, images, credits, dates, and roles approved.
- Resume, profile image, social links, favicon, and social preview assets supplied.
- Domain, HTTPS, email delivery, CMS authentication, and form delivery tested.
- Mobile, tablet, desktop, keyboard, reduced-motion, and WebGL-disabled states tested.
- Performance, accessibility, SEO, and contact-form acceptance checks passed.
- CMS backup and rollback process documented.
- At least one complete project can be published and updated without developer assistance.
