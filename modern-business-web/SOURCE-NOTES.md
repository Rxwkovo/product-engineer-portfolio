# Northstar sources and scope

Northstar is a fictional SaaS product and Personal Project / Demo. Pricing, team roles, milestones and tasks are illustrative. There is no checkout, account system or saved project data.

The current route concept was developed from the user-provided `Northstar (route concept, motion).html`. That AI-assisted design established the route metaphor, mist-blue / navy / amber palette, SVG route illustrations, section order and scroll narrative. This revision refines that direction: navigation clearance, responsive spacing, synchronized chapters and waypoints, idle animation scheduling, explicit theme and motion preferences, and a keyboard-operable sample workspace.

The earlier portfolio iteration used Start Bootstrap Landing Page v6.0.6 (MIT). Its original CSS and `LICENSE-STARTBOOTSTRAP` remain in this directory for provenance. The current route page does not load Bootstrap or any external animation library.

Bricolage Grotesque is distributed unmodified from the official Google Fonts repository under SIL Open Font License 1.1. The local font and `OFL-Bricolage.txt` are included. Headings and body text use this font. SVG illustrations are part of the user-provided route concept and subsequent implementation; no stock imagery or external icon pack is used.

## Motion and accessibility

Scrolling stays native. A single sticky story advances the route, current marker and active chapter; the feature route fills as its items enter view. Animation frames stop when progress settles. System reduced-motion settings and the page's Reduce motion control expose every chapter in a static layout. Short viewports also use the static layout. Navigation, phase tabs and preferences support keyboard operation. With JavaScript unavailable, the full narrative and default Build preview remain visible.
